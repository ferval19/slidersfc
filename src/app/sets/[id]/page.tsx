import { permanentRedirect } from 'next/navigation';

import { getSetDetail } from '@/lib/queries';
import { setPath } from '@/lib/paths';

/**
 * URLs antiguas por UUID. Se redirigen de forma permanente a /u/<usuario>/<slug>
 * para que cualquier enlace ya compartido siga funcionando.
 */
export default async function LegacySetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getSetDetail({ id });

  if (!detail) permanentRedirect('/');

  permanentRedirect(setPath(detail.owner.username, detail.set.slug));
}
