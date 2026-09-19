#!/usr/bin/env node
/**
 * Prueba la validación del perfil.
 *
 *   npm run test:profile
 *
 * Aquí se cuela lo que escribe cualquiera en su primer día: el nombre con
 * mayúsculas y acentos, la cuenta de X pegada como enlace entero, la
 * biografía de más. Y una comprobación que no es de comodidad sino de
 * seguridad: que la foto no pueda apuntar a un servidor ajeno.
 */

import { normalizeTwitterHandle, normalizeUsername, validateProfile } from '../src/lib/profile.ts';

const PREFIX = 'https://tsvupvrlpbbskjvpzgfl.supabase.co/storage/v1/object/public/avatars/';

let failures = 0;

function check(label, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

const base = { username: 'fullmanualfg', displayName: '', bio: '', twitterHandle: '', avatarUrl: '' };
const run = (input, options = {}) =>
  validateProfile({ ...base, ...input }, { avatarPrefix: PREFIX, ...options });

// --- Nombre de usuario ---------------------------------------------------
check('minúsculas y sin acentos', normalizeUsername('José María') === 'jose_maria');
check('quita la arroba de delante', normalizeUsername('@FullManualFG') === 'fullmanualfg');
check('el guión y el punto pasan a guión bajo', normalizeUsername('full-manual.fg') === 'full_manual_fg');
check('no pasa de 24 caracteres', normalizeUsername('a'.repeat(40)).length === 24);

check('dos caracteres no valen', 'error' in run({ username: 'fg' }));
check('un nombre normal vale', 'fields' in run({ username: 'Pepe_99' }));
{
  const result = run({ username: 'pepe!!' });
  check('los signos se rechazan con mensaje', 'error' in result, result.error);
}

// --- Cuenta de X ---------------------------------------------------------
check('enlace entero de x.com', normalizeTwitterHandle('https://x.com/FullManualFG') === 'FullManualFG');
check('enlace de twitter.com con barra', normalizeTwitterHandle('twitter.com/pepe/') === 'pepe');
check('con arroba', normalizeTwitterHandle('  @pepe ') === 'pepe');
check('vacío es null', normalizeTwitterHandle('   ') === null);
check('más de 15 caracteres se rechaza', 'error' in run({ twitterHandle: 'a'.repeat(16) }));

// --- Biografía y nombre visible ------------------------------------------
check('biografía de 281 se rechaza', 'error' in run({ bio: 'x'.repeat(281) }));
check('biografía de 280 vale', 'fields' in run({ bio: 'x'.repeat(280) }));
{
  const result = run({ bio: '   ', displayName: '  ' });
  check(
    'lo que se deja en blanco se guarda como null',
    'fields' in result && result.fields.bio === null && result.fields.display_name === null,
  );
}

// --- Foto ----------------------------------------------------------------
check(
  'una foto de nuestro almacén vale',
  'fields' in run({ avatarUrl: `${PREFIX}abc/1.jpg` }),
);
check(
  'una foto de fuera se rechaza',
  'error' in run({ avatarUrl: 'https://ejemplo.com/foto.jpg' }),
);
check(
  'la que ya estaba guardada pasa tal cual (la de X, sin tocarla)',
  'fields' in run(
    { avatarUrl: 'https://pbs.twimg.com/profile_images/1.jpg' },
    { currentAvatarUrl: 'https://pbs.twimg.com/profile_images/1.jpg' },
  ),
);
check(
  'pero no sirve para colar otra distinta',
  'error' in run(
    { avatarUrl: 'https://rastreador.example/pixel.jpg' },
    { currentAvatarUrl: 'https://pbs.twimg.com/profile_images/1.jpg' },
  ),
);

console.log('');
if (failures > 0) {
  console.error(`${failures} comprobación(es) fallida(s).`);
  process.exit(1);
}
console.log('Todo correcto.');
