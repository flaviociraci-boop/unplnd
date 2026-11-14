// UNPLND — account deletion (GDPR Art. 17 + App Store / Play requirement).
// Deletes the signed-in user and everything they own. The service_role key lives
// ONLY here (Deno.env) — never in the app bundle (31_SECURITY).
// Deploy: Dashboard → Edge Functions → "delete-account" → paste this file.
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY are injected automatically.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return Response.json({ error: 'unauthorized' }, { status: 401, headers: CORS });
  }

  const url = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

  // Identify the caller from their own JWT — a user can only ever delete themselves.
  const asUser = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
  const { data: userData, error: userErr } = await asUser.auth.getUser();
  if (userErr || !userData.user) {
    return Response.json({ error: 'unauthorized' }, { status: 401, headers: CORS });
  }
  const userId = userData.user.id;

  const admin = createClient(url, serviceKey);

  // 1. Remove stored photos (storage doesn't cascade with the DB).
  try {
    const { data: albums } = await admin.from('albums').select('id').eq('owner_id', userId);
    const albumIds = (albums ?? []).map((a) => a.id as string);
    if (albumIds.length > 0) {
      const { data: photos } = await admin.from('album_photos').select('storage_path').in('album_id', albumIds);
      const paths = (photos ?? []).map((p) => p.storage_path as string);
      if (paths.length > 0) await admin.storage.from('photos').remove(paths);
    }
  } catch {
    // Best effort — never block the deletion the user asked for over a leftover file.
  }

  // 1b. Everything else the user uploaded: profile and group pictures (avatars/<uid>/…),
  //     photos of published evenings (published-photos/<uid>/…) and the images and voice
  //     notes they sent in chats (chat-media/<conversation>/…, referenced by their messages).
  try {
    await removeFolder(admin, 'avatars', userId);
    await removeFolder(admin, 'published-photos', userId);
    const { data: media } = await admin
      .from('messages')
      .select('image_path, audio_path')
      .eq('sender_id', userId);
    const chatPaths = (media ?? [])
      .flatMap((m) => [m.image_path as string | null, m.audio_path as string | null])
      .filter((p): p is string => !!p);
    for (let i = 0; i < chatPaths.length; i += 100) {
      await admin.storage.from('chat-media').remove(chatPaths.slice(i, i + 100));
    }
  } catch {
    // Best effort, as above.
  }

  // 2. Delete the auth user → cascades every owned row (profiles, plans, albums,
  //    album_photos, favorites, notifications, chats, connections …; feedback and reports
  //    are kept anonymized via set-null).
  const { error: delErr } = await admin.auth.admin.deleteUser(userId);
  if (delErr) {
    return Response.json(
      { error: { code: 'DELETE_FAILED', message: 'We couldn’t complete that. Please try again.' } },
      { status: 500, headers: CORS },
    );
  }

  return Response.json({ ok: true }, { headers: CORS });
});

/** Removes every file below `prefix` in `bucket`, walking sub-folders (storage has no recursive delete). */
// deno-lint-ignore no-explicit-any
async function removeFolder(admin: any, bucket: string, prefix: string): Promise<void> {
  const { data: entries } = await admin.storage.from(bucket).list(prefix, { limit: 1000 });
  const files: string[] = [];
  for (const entry of entries ?? []) {
    const path = `${prefix}/${entry.name}`;
    // Folders come back without an id.
    if (entry.id === null || entry.id === undefined) await removeFolder(admin, bucket, path);
    else files.push(path);
  }
  for (let i = 0; i < files.length; i += 100) {
    await admin.storage.from(bucket).remove(files.slice(i, i + 100));
  }
}
