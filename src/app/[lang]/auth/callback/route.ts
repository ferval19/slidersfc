import { type NextRequest } from 'next/server';

import { handleAuthCallback } from '@/lib/auth-callback';

/** Vuelta del OAuth (X). */
export const GET = (request: NextRequest) => handleAuthCallback(request);
