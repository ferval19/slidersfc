import { permanentRedirect } from 'next/navigation';

import { getSetDetail } from '@/lib/queries';
import { editSetPath } from '@/lib/paths';

/** URL antigua de edición. */
export default async function LegacyEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getSetDetail({ id });

  if (!detail) permanentRedirect('/');

  permanentRedirect(editSetPath(detail.owner.username, detail.set.slug));
}
