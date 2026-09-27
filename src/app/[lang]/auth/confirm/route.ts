import { type NextRequest } from 'next/server';

import { handleAuthCallback } from '@/lib/auth-callback';

/** Vuelta del magic link por email. */
export const GET = (request: NextRequest, { params }: { params: Promise<{ lang?: string }> }) =>
  handleAuthCallback(request, params);
