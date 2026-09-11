import type { Metadata } from 'next';

import { AuthHashHandler } from '@/components/auth-hash-handler';
import { safeNextPath } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Entrando',
  robots: { index: false },
};

export default async function FinalizeAuthPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-5 py-24">
      <AuthHashHandler next={safeNextPath(next)} />
    </div>
  );
}
