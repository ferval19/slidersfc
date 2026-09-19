'use client';

/* eslint-disable @next/next/no-img-element */

import { useActionState, useRef, useState } from 'react';

import type { ProfileFormState } from '@/app/actions/profile';
import { PitchDiagram } from '@/components/chalk';
import { AVATAR_BUCKET, avatarObjectPath } from '@/lib/avatar-storage';
import { ACCEPTED_IMAGE_TYPES, prepareAvatar } from '@/lib/image';
import { BIO_MAX, DISPLAY_NAME_MAX, normalizeUsername, TWITTER_MAX } from '@/lib/profile';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/database.types';

type Props = {
  action: (state: ProfileFormState, formData: FormData) => Promise<ProfileFormState>;
  profile: Profile;
  /** Para enseñar la dirección real del perfil mientras se escribe el nombre. */
  siteHost: string;
};

const initialState: ProfileFormState = {};

export function ProfileForm({ action, profile, siteHost }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [username, setUsername] = useState(profile.username);
  const [displayName, setDisplayName] = useState(profile.display_name ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [twitter, setTwitter] = useState(profile.twitter_handle ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '');

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const renamed = username !== profile.username;
  const shownName = displayName.trim() || username || profile.username;

  const pickAvatar = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      const blob = await prepareAvatar(file);
      const supabase = createSupabaseBrowserClient();

      const path = avatarObjectPath(profile.id);
      const { error } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, blob, { contentType: 'image/jpeg' });

      if (error) throw error;

      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
    } catch (error) {
      setUploadError(uploadMessage(error));
    } finally {
      setUploading(false);
      // Para que elegir dos veces el mismo fichero vuelva a disparar el evento.
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <input type="hidden" name="avatar_url" value={avatarUrl} />

      {/* ------------------------------------------------------------------
          La ficha. Es lo primero porque es lo que se está editando: la foto se
          cambia pinchando en ella, y el nombre y la biografía se ven aquí tal
          como van a salir en la página pública.
      ------------------------------------------------------------------ */}
      <section>
        <p className="eyebrow">Así te verán</p>

        <div className="panel relative mt-3 overflow-hidden p-6 sm:p-8">
          {/* El campo asoma por la esquina. La máscara le come el borde: sin
              ella, la línea de banda cruza la ficha entera y parece un filete
              del panel, no un dibujo de fondo. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-28 -right-24 h-[260%] opacity-[0.07]"
            style={{
              maskImage: 'radial-gradient(130% 110% at 100% 0%, #000 25%, transparent 72%)',
              WebkitMaskImage: 'radial-gradient(130% 110% at 100% 0%, #000 25%, transparent 72%)',
            }}
          >
            <PitchDiagram className="h-full w-auto" />
          </div>

          <div className="relative flex flex-wrap items-start gap-6">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="group relative size-28 shrink-0 overflow-hidden rounded-full border border-chalk-line bg-board-deep transition-colors hover:border-chalk disabled:cursor-wait"
                aria-label="Cambiar la foto"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="size-full object-cover" />
                ) : (
                  <span
                    aria-hidden
                    className="display grid size-full place-items-center text-5xl text-chalk-dim"
                  >
                    {shownName.charAt(0).toUpperCase()}
                  </span>
                )}

                <span className="eyebrow absolute inset-x-0 bottom-0 bg-board-deep/85 py-1.5 text-center text-chalk opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {uploading ? '···' : 'Cambiar'}
                </span>
              </button>

              {avatarUrl ? (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="eyebrow hover:text-chalk"
                >
                  Quitar
                </button>
              ) : null}

              <input
                ref={fileInput}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void pickAvatar(file);
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="display text-[clamp(2rem,5vw,3rem)] break-words">{shownName}</h2>
              <p className="mt-1 font-mono text-xs text-chalk-dim">
                @{username || profile.username}
                {twitter.trim() ? ` · X: @${twitter.trim().replace(/^@+/, '')}` : ''}
              </p>
              {bio.trim() ? (
                <p className="mt-3 max-w-prose text-sm whitespace-pre-line text-chalk/90">{bio}</p>
              ) : (
                <p className="mt-3 text-sm text-chalk-dim/70 italic">
                  Sin biografía. Lo que escribas abajo sale aquí.
                </p>
              )}
            </div>
          </div>

        </div>

        {uploadError ? (
          <p className="mt-2.5 text-xs text-ink-rival" role="alert">
            {uploadError}
          </p>
        ) : (
          <p className="mt-2.5 text-xs text-chalk-dim">
            Pincha en la foto para cambiarla. Se recorta en cuadrado y se guarda a 512 px: JPG,
            PNG o WEBP.
          </p>
        )}
      </section>

      {/* Campos ---------------------------------------------------------- */}
      <section className="panel flex flex-col gap-6 p-5 sm:p-6">
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow">Nombre</span>
          <input
            name="display_name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            maxLength={DISPLAY_NAME_MAX}
            placeholder="Full Manual FG"
            className="field"
          />
          <span className="text-xs text-chalk-dim">
            Como quieres que te llamen. Si lo dejas vacío, sale tu nombre de usuario.
          </span>
        </label>

        <div className="flex flex-col gap-1.5">
          <label className="eyebrow" htmlFor="username">
            Nombre de usuario
          </label>
          <div className="field flex items-center gap-0 p-0 focus-within:border-chalk/45">
            {/* En el móvil sólo cabe /u/: con el dominio delante, el nombre
                que se está escribiendo se sale del campo. */}
            <span className="shrink-0 py-2.5 pl-3 font-mono text-sm text-chalk-dim">
              <span className="hidden sm:inline">{siteHost}</span>/u/
            </span>
            <input
              id="username"
              name="username"
              value={username}
              onChange={(event) => setUsername(normalizeUsername(event.target.value))}
              required
              minLength={3}
              placeholder="fullmanualfg"
              className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pr-3 font-mono text-sm text-chalk outline-none"
            />
          </div>

          {renamed ? (
            <span className="text-xs text-ink-user">
              Cambia la dirección de tu perfil y la de todos tus sets. Los enlaces que ya hayas
              compartido seguirán funcionando: llevarán a la nueva.
            </span>
          ) : (
            <span className="text-xs text-chalk-dim">
              Minúsculas, números y guión bajo. Es lo que aparece en la dirección de tus sets.
            </span>
          )}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow">Biografía</span>
          <textarea
            name="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={4}
            maxLength={BIO_MAX}
            placeholder="Cómo juegas: dificultad, duración de los tiempos, cámara, mando o teclado. Es lo que da sentido a tus valores."
            className="field resize-y"
          />
          <span
            className={`self-end font-mono text-xs ${
              bio.length > BIO_MAX - 20 ? 'text-ink-user' : 'text-chalk-dim'
            }`}
          >
            {bio.length}/{BIO_MAX}
          </span>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow">Cuenta de X</span>
          <div className="field flex items-center gap-0 p-0 focus-within:border-chalk/45">
            <span className="shrink-0 py-2.5 pl-3 font-mono text-sm text-chalk-dim">@</span>
            <input
              name="twitter_handle"
              value={twitter}
              onChange={(event) => setTwitter(event.target.value)}
              maxLength={TWITTER_MAX + 20}
              placeholder="FullManualFG"
              className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pr-3 font-mono text-sm text-chalk outline-none"
            />
          </div>
          <span className="text-xs text-chalk-dim">
            Puedes pegar el enlace entero; se queda con el nombre.
          </span>
        </label>
      </section>

      {state.error ? (
        <p
          className="border border-ink-rival/50 bg-ink-rival/10 px-3 py-2.5 text-sm text-ink-rival"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-3 bg-board/95 px-5 py-4 backdrop-blur">
        <button type="submit" className="btn btn-primary" disabled={pending || uploading}>
          {pending ? 'Guardando…' : 'Guardar perfil'}
        </button>
        <a href={`/u/${profile.username}`} className="btn btn-ghost">
          Cancelar
        </a>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------

/**
 * Traduce lo que devuelve Storage. El caso del almacén que falta merece
 * mensaje propio: es la puesta en marcha a medias, no un fallo de la persona.
 */
function uploadMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (/bucket not found/i.test(message)) {
    return 'Falta crear el almacén de avatares en Supabase (supabase/storage/01_avatars.sql).';
  }
  if (/exceeded the maximum allowed size|payload too large/i.test(message)) {
    return 'La foto pesa demasiado incluso reducida. Prueba con otra.';
  }
  if (/row-level security|not authorized|403/i.test(message)) {
    return 'No tienes permiso para subir la foto. Vuelve a entrar e inténtalo otra vez.';
  }
  return message || 'No se ha podido subir la foto.';
}
