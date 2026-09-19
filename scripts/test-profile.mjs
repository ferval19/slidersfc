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

import {
  normalizeTwitterHandle,
  normalizeUsername,
  normalizeYoutube,
  validateProfile,
} from '../src/lib/profile.ts';

const PREFIX = 'https://tsvupvrlpbbskjvpzgfl.supabase.co/storage/v1/object/public/avatars/';

let failures = 0;

function check(label, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

const base = {
  username: 'fullmanualfg',
  displayName: '',
  bio: '',
  twitterHandle: '',
  avatarUrl: '',
  youtubeUrl: '',
};
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

// --- Canal de YouTube -----------------------------------------------------
check('vacío es null', normalizeYoutube('') === null);
check('sólo espacios es null', normalizeYoutube('   ') === null);
check('con arroba', normalizeYoutube('@FullManualFG') === 'https://www.youtube.com/@FullManualFG');
check(
  'texto suelto sin barras ni puntos se asume como handle',
  normalizeYoutube('FullManualFG') === 'https://www.youtube.com/@FullManualFG',
);
check('sin protocolo', normalizeYoutube('youtube.com/@xyz') === 'https://www.youtube.com/@xyz');
check('con www', normalizeYoutube('www.youtube.com/@xyz') === 'https://www.youtube.com/@xyz');
check('con http', normalizeYoutube('http://youtube.com/@xyz') === 'https://www.youtube.com/@xyz');
check(
  'con el subdominio móvil',
  normalizeYoutube('https://m.youtube.com/@xyz') === 'https://www.youtube.com/@xyz',
);
check(
  'quita la subruta /videos',
  normalizeYoutube('https://www.youtube.com/@xyz/videos') === 'https://www.youtube.com/@xyz',
);
check(
  'quita ?sub_confirmation=1',
  normalizeYoutube('https://www.youtube.com/@xyz?sub_confirmation=1') === 'https://www.youtube.com/@xyz',
);
check(
  'quita la barra final',
  normalizeYoutube('https://www.youtube.com/@xyz/') === 'https://www.youtube.com/@xyz',
);
check(
  'formato /channel/UC...',
  normalizeYoutube('https://www.youtube.com/channel/UCabc123') ===
    'https://www.youtube.com/channel/UCabc123',
);
check(
  'formato /c/...',
  normalizeYoutube('https://www.youtube.com/c/NombreCanal') === 'https://www.youtube.com/c/NombreCanal',
);
check(
  'formato /user/...',
  normalizeYoutube('https://www.youtube.com/user/NombreViejo') ===
    'https://www.youtube.com/user/NombreViejo',
);

check(
  'un vídeo de youtu.be se rechaza (no es un canal)',
  normalizeYoutube('https://youtu.be/dQw4w9WgXcQ') === undefined,
);
check(
  'un vídeo con /watch se rechaza (no es un canal)',
  normalizeYoutube('https://www.youtube.com/watch?v=dQw4w9WgXcQ') === undefined,
);
check('otro dominio se rechaza', normalizeYoutube('https://vimeo.com/x') === undefined);
check('twitch tampoco vale', normalizeYoutube('https://twitch.tv/x') === undefined);
check('un dominio cualquiera se rechaza', normalizeYoutube('https://ejemplo.com') === undefined);
check('una arroba sola se rechaza', normalizeYoutube('@') === undefined);
check(
  'un identificador demasiado corto se rechaza',
  normalizeYoutube('@ab') === undefined,
);

check(
  'validateProfile devuelve el error del canal con una entrada mala',
  'error' in run({ youtubeUrl: '@ab' }),
);
{
  const result = run({ youtubeUrl: '@FullManualFG' });
  check(
    'validateProfile devuelve la URL canónica en fields.youtube_url',
    'fields' in result && result.fields.youtube_url === 'https://www.youtube.com/@FullManualFG',
  );
}
{
  const result = run({ youtubeUrl: '@FullManualFG' });
  check(
    'un canal válido no rompe el resto de campos',
    'fields' in result &&
      result.fields.username === 'fullmanualfg' &&
      result.fields.display_name === null &&
      result.fields.bio === null &&
      result.fields.twitter_handle === null &&
      result.fields.avatar_url === null,
  );
}

console.log('');
if (failures > 0) {
  console.error(`${failures} comprobación(es) fallida(s).`);
  process.exit(1);
}
console.log('Todo correcto.');
