'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { authErrorFrom } from '@/lib/auth-errors';

/**
 * Cuando Supabase no puede validar un enlace de acceso, devuelve al usuario a
 * la Site URL del proyecto con el error en la query y en el fragmento. Esa URL
 * puede ser cualquier página, así que este componente vive en el layout: si
 * detecta un error de acceso, lleva a /login con el motivo en lugar de dejar
 * la portada como si no hubiera pasado nada.
 *
 * Va en cliente porque el fragmento (#error=...) no llega al servidor.
 */
export function AuthErrorRelay() {
  const router = useRouter();

  useEffect(() => {
    const fromQuery = authErrorFrom(new URLSearchParams(window.location.search));
    const fromHash = authErrorFrom(new URLSearchParams(window.location.hash.replace(/^#/, '')));
    const message = fromQuery ?? fromHash;

    if (!message) return;

    router.replace(`/login?error=${encodeURIComponent(message)}`);
  }, [router]);

  return null;
}
