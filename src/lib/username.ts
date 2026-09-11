import type { User } from '@supabase/supabase-js';

/**
 * Deriva un username a partir de la cuenta, igual que hace el trigger
 * `handle_new_user` en la base de datos. Se duplica la lógica a propósito: el
 * trigger cubre el registro normal y esto cubre la reparación desde la app
 * cuando, por lo que sea, la fila de perfil no existe.
 */
export function deriveUsername(user: User) {
  const raw =
    (user.user_metadata?.user_name as string | undefined) ??
    (user.user_metadata?.preferred_username as string | undefined) ??
    user.email?.split('@')[0] ??
    '';

  const base = raw.toLowerCase().replace(/[^a-z0-9_]/g, '');

  return (base.length < 3 ? 'player' : base).slice(0, 20);
}

export function displayNameFor(user: User, fallback: string) {
  return (
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    fallback
  );
}
