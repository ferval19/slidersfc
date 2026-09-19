#!/usr/bin/env node
/**
 * Convierte un volcado de la base en SQL con el que reponerla.
 *
 * El JSON es la copia de archivo; esto es lo que la hace útil. Una copia que
 * no sabes reponer no es una copia, y el camino de reposición de este proyecto
 * ya existe y es conocido: pegar SQL en el editor de Supabase.
 *
 * Qué NO se repone aquí, a propósito: los juegos y el catálogo de sliders, que
 * son código (`supabase/seed/catalog.mjs` → `01_catalog.sql`). Reponerlos desde
 * una copia sería quedarse con una foto vieja del catálogo.
 *
 * Tres decisiones que no son evidentes:
 *
 * 1. Los sets y los comentarios conservan su UUID original. Así las URLs por
 *    id siguen valiendo y los comentarios siguen colgando de su set sin tener
 *    que reconstruir nada.
 * 2. El dueño y el juego NO van por id, sino por nombre de usuario y por slug.
 *    Los ids de `profiles` vienen de `auth.users` y los de `games` son series:
 *    en un proyecto nuevo no coinciden.
 * 3. Los valores se resuelven por (slug del slider, ámbito), no por el id de
 *    la definición, que cambia cada vez que se reaplica el catálogo. Es el
 *    mismo apaño que usan los ficheros de inicio.
 *
 * Módulo puro: no toca la red ni el disco, para poder probarlo.
 */

const q = (value) => `'${String(value).replace(/'/g, "''")}'`;
const qn = (value) => (value === null || value === undefined ? 'null' : q(value));

/**
 * @param dump El volcado, con la forma que escribe `scripts/backup.mjs`:
 *   `{ generado, origen, tablas: { profiles, games, slider_definitions,
 *      slider_sets, slider_set_values, slider_comments } }`
 * @returns El SQL, listo para pegar en el editor de Supabase.
 */
export function buildRestoreSql(dump) {
  const { tablas } = dump;

  const gameById = new Map(tablas.games.map((game) => [game.id, game]));
  const profileById = new Map(tablas.profiles.map((profile) => [profile.id, profile]));
  // (id de definición) → cómo referirse a ella sin usar su id.
  const definitionById = new Map(
    tablas.slider_definitions.map((definition) => [
      definition.id,
      { slug: definition.slug, applies_to: definition.applies_to },
    ]),
  );

  const valuesBySet = groupBy(tablas.slider_set_values, (row) => row.slider_set_id);
  const commentsBySet = groupBy(tablas.slider_comments, (row) => row.slider_set_id);

  const lines = [
    '-- Copia de SlidersFC.',
    `-- Generada el ${dump.generado} desde ${dump.origen}.`,
    '--',
    '-- Cómo reponer, en este orden:',
    '--   1. Las migraciones de supabase/migrations/ y supabase/seed/01_catalog.sql.',
    '--   2. Que cada persona haya entrado una vez en la aplicación, para que',
    '--      exista su cuenta en auth.users. Sin eso su perfil no se puede crear.',
    '--   3. Este fichero.',
    '--',
    '-- Cada bloque `do` es atómico y se puede reejecutar: si sólo quieres',
    '-- recuperar un set, pega su bloque y nada más.',
    '',
  ];

  for (const profile of tablas.profiles) {
    lines.push(...profileBlock(profile));
  }

  for (const set of tablas.slider_sets) {
    const owner = profileById.get(set.owner_id);
    const game = gameById.get(set.game_id);

    // Sin dueño o sin juego no hay forma honrada de reponerlo: mejor decirlo
    // en el propio fichero que generar SQL que falle a medias.
    if (!owner || !game) {
      lines.push(
        `-- OMITIDO el set ${q(set.title)} (${set.id}): falta en la copia ` +
          `${!owner ? 'su dueño' : 'su juego'}.`,
        '',
      );
      continue;
    }

    lines.push(
      ...setBlock({
        set,
        owner,
        game,
        values: valuesBySet.get(set.id) ?? [],
        comments: commentsBySet.get(set.id) ?? [],
        definitionById,
        profileById,
      }),
    );
  }

  return `${lines.join('\n')}\n`;
}

// ---------------------------------------------------------------------------

function profileBlock(profile) {
  return [
    `-- Perfil @${profile.username} ${'-'.repeat(Math.max(0, 60 - profile.username.length))}`,
    'do $$',
    'begin',
    `  if not exists (select 1 from auth.users where id = ${q(profile.id)}) then`,
    '    raise exception',
    `      'Falta la cuenta de @% en auth.users. Que entre una vez en la aplicación y vuelve a ejecutar esto.',`,
    `      ${q(profile.username)};`,
    '  end if;',
    '',
    '  insert into public.profiles',
    '    (id, username, display_name, avatar_url, twitter_handle, youtube_url, bio, created_at)',
    '  values (',
    `    ${q(profile.id)},`,
    `    ${q(profile.username)},`,
    `    ${qn(profile.display_name)},`,
    `    ${qn(profile.avatar_url)},`,
    `    ${qn(profile.twitter_handle)},`,
    `    ${qn(profile.youtube_url ?? null)},`,
    `    ${qn(profile.bio)},`,
    `    ${q(profile.created_at)}`,
    '  )',
    '  on conflict (id) do update',
    '    set username       = excluded.username,',
    '        display_name   = excluded.display_name,',
    '        avatar_url     = excluded.avatar_url,',
    '        twitter_handle = excluded.twitter_handle,',
    '        youtube_url    = excluded.youtube_url,',
    '        bio            = excluded.bio;',
    'end $$;',
    '',
  ];
}

function setBlock({ set, owner, game, values, comments, definitionById, profileById }) {
  const lines = [
    `-- Set ${q(set.title)} — @${owner.username}/${set.slug ?? set.id}`,
    'do $$',
    'declare',
    `  target_set   constant uuid := ${q(set.id)};`,
    '  owner_profile uuid;',
    '  target_game   int;',
    '  missing       text;',
    'begin',
    `  select id into owner_profile from public.profiles where username = ${q(owner.username)};`,
    '  if owner_profile is null then',
    `    raise exception 'Falta el perfil @%.', ${q(owner.username)};`,
    '  end if;',
    '',
    `  select id into target_game from public.games where slug = ${q(game.slug)};`,
    '  if target_game is null then',
    `    raise exception 'Falta el juego %. Aplica supabase/seed/01_catalog.sql.', ${q(game.slug)};`,
    '  end if;',
    '',
    '  insert into public.slider_sets',
    '    (id, owner_id, game_id, title, slug, description, cpu_behaviour, version, is_published, created_at, updated_at)',
    '  values (',
    '    target_set, owner_profile, target_game,',
    `    ${q(set.title)},`,
    `    ${qn(set.slug)},`,
    `    ${qn(set.description)},`,
    `    ${q(set.cpu_behaviour ?? 'custom')},`,
    `    ${Number(set.version ?? 1)},`,
    `    ${set.is_published ? 'true' : 'false'},`,
    `    ${q(set.created_at)},`,
    `    ${q(set.updated_at)}`,
    '  )',
    '  on conflict (id) do update',
    '    set owner_id     = excluded.owner_id,',
    '        game_id      = excluded.game_id,',
    '        title        = excluded.title,',
    '        slug         = excluded.slug,',
    '        description  = excluded.description,',
    '        cpu_behaviour = excluded.cpu_behaviour,',
    '        version      = excluded.version,',
    '        is_published = excluded.is_published,',
    '        updated_at   = excluded.updated_at;',
    '',
  ];

  const rows = values
    .map((row) => ({ definition: definitionById.get(row.slider_definition_id), value: row.value }))
    .filter((row) => row.definition);

  if (rows.length > 0) {
    lines.push(
      '  -- Los valores se reponen enteros: esto es una instantánea, no un parche.',
      '  delete from public.slider_set_values where slider_set_id = target_set;',
      '',
      '  with incoming (slug, applies_to, value) as (values',
      ...rows.map(
        (row, index) =>
          `    (${q(row.definition.slug)}::text, ${q(row.definition.applies_to)}::text, ${Number(row.value)}::int)` +
          (index === rows.length - 1 ? '' : ','),
      ),
      '  ),',
      '  matched as (',
      '    select i.slug, i.applies_to, i.value, d.id as definition_id',
      '    from incoming i',
      '    left join public.slider_definitions d',
      '      on d.game_id = target_game and d.slug = i.slug and d.applies_to = i.applies_to',
      '  ),',
      '  inserted as (',
      '    insert into public.slider_set_values (slider_set_id, slider_definition_id, value)',
      '    select target_set, definition_id, value from matched where definition_id is not null',
      '    returning 1',
      '  )',
      "  select string_agg(format('%s (%s)', slug, applies_to), ', ')",
      '  into missing',
      '  from matched where definition_id is null;',
      '',
      '  if missing is not null then',
      '    raise exception',
      `      'Estos sliders no están en el catálogo de %: %. Aplica supabase/seed/01_catalog.sql.',`,
      `      ${q(game.slug)}, missing;`,
      '  end if;',
      '',
    );
  }

  const restorable = comments
    .map((comment) => ({
      comment,
      author: profileById.get(comment.author_id),
      definition:
        comment.slider_definition_id === null
          ? null
          : definitionById.get(comment.slider_definition_id),
    }))
    // Un comentario cuyo autor no está en la copia no se puede reponer: la
    // autoría es una clave ajena, no un nombre suelto. Y uno que apunta a un
    // slider que tampoco está se caería al reponerlo como si fuera general.
    .filter((row) => row.author && (row.comment.slider_definition_id === null || row.definition));

  if (restorable.length > 0) {
    lines.push(
      '  -- Los comentarios sólo se añaden: lo que ya esté escrito no se pisa.',
      '  insert into public.slider_comments',
      '    (id, slider_set_id, slider_definition_id, author_id, body, set_version, created_at)',
      '  select',
      '    v.id, target_set, d.id, p.id, v.body, v.set_version, v.created_at',
      '  from (values',
      ...restorable.map(({ comment, author, definition }, index) => {
        const row =
          `    (${q(comment.id)}::uuid, ${qn(definition?.slug ?? null)}::text, ` +
          `${qn(definition?.applies_to ?? null)}::text, ${q(author.username)}::text, ` +
          `${q(comment.body)}::text, ${Number(comment.set_version ?? 1)}::int, ` +
          `${q(comment.created_at)}::timestamptz)`;
        return index === restorable.length - 1 ? row : `${row},`;
      }),
      '  ) as v (id, slider_slug, applies_to, author, body, set_version, created_at)',
      '  left join public.slider_definitions d',
      '    on d.game_id = target_game and d.slug = v.slider_slug and d.applies_to = v.applies_to',
      '  join public.profiles p on p.username = v.author',
      '  on conflict (id) do nothing;',
      '',
    );
  }

  lines.push('end $$;', '');
  return lines;
}

function groupBy(rows, key) {
  const grouped = new Map();
  for (const row of rows) {
    const bucket = grouped.get(key(row));
    if (bucket) bucket.push(row);
    else grouped.set(key(row), [row]);
  }
  return grouped;
}
