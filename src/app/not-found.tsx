import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Esto no existe</h1>
      <p className="mt-4 text-sm text-muted">
        El set puede haberse borrado, o ser un borrador que sólo ve su autor.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Volver al feed
      </Link>
    </div>
  );
}
