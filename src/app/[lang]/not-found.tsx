import Link from 'next/link';

import { EmptyBoardDrawing } from '@/components/chalk';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <EmptyBoardDrawing className="w-52" />
      <p className="eyebrow mt-8">Error 404</p>
      <h1 className="display mt-3 text-6xl">Esto no existe</h1>
      <p className="mt-5 text-sm text-chalk-dim">
        El set puede haberse borrado, o ser un borrador que sólo ve su autor.
      </p>
      <Link href="/" className="btn btn-primary mt-9">
        Volver al feed
      </Link>
    </div>
  );
}
