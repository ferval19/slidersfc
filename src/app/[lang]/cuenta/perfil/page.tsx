import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { updateProfile } from '@/app/actions/profile';
import { ProfileForm } from '@/components/profile-form';
import { getSiteOrigin } from '@/lib/site-url';
import { getSessionProfile } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Editar perfil',
  robots: { index: false },
};

export default async function EditProfilePage() {
  const { user, profile } = await getSessionProfile();

  if (!user) redirect('/login?next=/cuenta/perfil');
  // Sesión sin fila de perfil: /perfil la crea. Vale con que exista; desde la
  // página pública se vuelve aquí en un clic.
  if (!profile) redirect('/perfil');

  const origin = await getSiteOrigin();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <header className="pb-8">
        <p className="eyebrow">Tu ficha</p>
        <h1 className="display mt-3 text-[clamp(2.75rem,8vw,4.5rem)]">Editar perfil</h1>
        <p className="mt-4 max-w-prose text-sm text-chalk-dim">
          Quien abre un set tuyo quiere saber quién lo firma y cómo juega. Es lo que separa unos
          valores sueltos de unos valores en los que fiarse.
        </p>
      </header>

      <ProfileForm
        action={updateProfile}
        profile={profile}
        siteHost={origin.replace(/^https?:\/\//, '')}
      />
    </div>
  );
}
