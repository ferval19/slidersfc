/**
 * Las banderas de los países que salen en los retos: el cuerpo de un SVG de
 * 30 × 20, sin la etiqueta `<svg>`, por código ISO 3166-1 alfa-2. Dibujadas a
 * mano, sin dependencias. Un código que no esté aquí no pinta bandera.
 *
 * Es un módulo sin importaciones (más allá de tipos) para que lo cargue tal
 * cual `scripts/test-retos.mjs`, que comprueba que cada `pais` de un reto
 * tiene la suya.
 */
export type Bandera = { nombre: string; cuerpo: string };

export const BANDERAS: Record<string, Bandera> = {
  ES: {
    nombre: 'España',
    cuerpo:
      '<rect width="30" height="20" fill="#c60b1e"/><rect y="5" width="30" height="10" fill="#ffc400"/>',
  },
  AR: {
    nombre: 'Argentina',
    cuerpo:
      '<rect width="30" height="20" fill="#74acdf"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><circle cx="15" cy="10" r="2.2" fill="#f6b40e"/>',
  },
  SI: {
    nombre: 'Eslovenia',
    cuerpo:
      '<rect width="30" height="20" fill="#fff"/><rect y="6.67" width="30" height="6.67" fill="#005da4"/><rect y="13.33" width="30" height="6.67" fill="#ed1c24"/><path d="M6 4h6v5c0 2.2-1.4 3.6-3 4.2C7.4 12.6 6 11.2 6 9z" fill="#005da4" stroke="#ed1c24" stroke-width=".8"/>',
  },
  SK: {
    nombre: 'Eslovaquia',
    cuerpo:
      '<rect width="30" height="20" fill="#fff"/><rect y="6.67" width="30" height="6.67" fill="#0b4ea2"/><rect y="13.33" width="30" height="6.67" fill="#ee1c25"/><path d="M6.5 4.5h7v6c0 2.6-1.8 4.2-3.5 4.8-1.7-.6-3.5-2.2-3.5-4.8z" fill="#ee1c25" stroke="#fff" stroke-width=".8"/><path d="M10 6v7M8.3 8h3.4M7.8 10h4.4" stroke="#fff" stroke-width=".9"/>',
  },
  DK: {
    nombre: 'Dinamarca',
    cuerpo:
      '<rect width="30" height="20" fill="#c8102e"/><rect x="9" width="3.5" height="20" fill="#fff"/><rect y="8.25" width="30" height="3.5" fill="#fff"/>',
  },
  US: {
    nombre: 'Estados Unidos',
    cuerpo:
      '<rect width="30" height="20" fill="#fff"/><g fill="#b22234"><rect width="30" height="1.54"/><rect y="3.08" width="30" height="1.54"/><rect y="6.15" width="30" height="1.54"/><rect y="9.23" width="30" height="1.54"/><rect y="12.31" width="30" height="1.54"/><rect y="15.38" width="30" height="1.54"/><rect y="18.46" width="30" height="1.54"/></g><rect width="12" height="10.77" fill="#3c3b6e"/>',
  },
  MX: {
    nombre: 'México',
    cuerpo:
      '<rect width="30" height="20" fill="#fff"/><rect width="10" height="20" fill="#006847"/><rect x="20" width="10" height="20" fill="#ce1126"/><circle cx="15" cy="10" r="2.4" fill="#8c6a2f"/>',
  },
  KR: {
    nombre: 'Corea del Sur',
    cuerpo:
      '<rect width="30" height="20" fill="#fff"/><path d="M11 10a4 4 0 0 1 8 0z" fill="#cd2e3a"/><path d="M11 10a4 4 0 0 0 8 0z" fill="#0047a0"/><g stroke="#000" stroke-width=".9"><path d="M4 4l3 2M4.7 3l3 2M5.4 2l3 2M22 16l3 2M22.7 15l3 2M23.4 14l3 2M22 4l3-2M22.7 5l3-2M4 16l3 2M4.7 17l3 2"/></g>',
  },
  NG: {
    nombre: 'Nigeria',
    cuerpo:
      '<rect width="30" height="20" fill="#fff"/><rect width="10" height="20" fill="#008751"/><rect x="20" width="10" height="20" fill="#008751"/>',
  },
  NO: {
    nombre: 'Noruega',
    cuerpo:
      '<rect width="30" height="20" fill="#ba0c2f"/><rect x="8" width="5" height="20" fill="#fff"/><rect y="7.5" width="30" height="5" fill="#fff"/><rect x="9.25" width="2.5" height="20" fill="#00205b"/><rect y="8.75" width="30" height="2.5" fill="#00205b"/>',
  },
  CA: {
    nombre: 'Canadá',
    cuerpo:
      '<rect width="30" height="20" fill="#fff"/><rect width="7.5" height="20" fill="#d80621"/><rect x="22.5" width="7.5" height="20" fill="#d80621"/><path d="M15 4l1.2 2.4 1.6-.6-.6 3.6 1.8-1.4.4 1.6 1.8-.2-1 2 .6.6-3.2 1.6.4 1.4H15.6V17h-1.2v-2.4h-2.4l.4-1.4-3.2-1.6.6-.6-1-2 1.8.2.4-1.6 1.8 1.4-.6-3.6 1.6.6z" fill="#d80621"/>',
  },
  PT: {
    nombre: 'Portugal',
    cuerpo:
      '<rect width="30" height="20" fill="#da291c"/><rect width="12" height="20" fill="#046a38"/><circle cx="12" cy="10" r="3.2" fill="#ffe900" stroke="#da291c" stroke-width=".6"/>',
  },
  SE: {
    nombre: 'Suecia',
    cuerpo:
      '<rect width="30" height="20" fill="#006aa7"/><rect x="9" width="3.5" height="20" fill="#fecc00"/><rect y="8.25" width="30" height="3.5" fill="#fecc00"/>',
  },
  PY: {
    nombre: 'Paraguay',
    cuerpo:
      '<rect width="30" height="20" fill="#fff"/><rect width="30" height="6.67" fill="#d52b1e"/><rect y="13.33" width="30" height="6.67" fill="#0038a8"/><circle cx="15" cy="10" r="2.2" fill="none" stroke="#0038a8" stroke-width=".7"/>',
  },
  GR: {
    nombre: 'Grecia',
    cuerpo:
      '<rect width="30" height="20" fill="#0d5eaf"/><g fill="#fff"><rect y="2.22" width="30" height="2.22"/><rect y="6.67" width="30" height="2.22"/><rect y="11.11" width="30" height="2.22"/><rect y="15.56" width="30" height="2.22"/></g><rect width="11.11" height="11.11" fill="#0d5eaf"/><rect x="4.44" width="2.22" height="11.11" fill="#fff"/><rect y="4.44" width="11.11" height="2.22" fill="#fff"/>',
  },
  BR: {
    nombre: 'Brasil',
    cuerpo:
      '<rect width="30" height="20" fill="#009c3b"/><path d="M15 2.5L27 10 15 17.5 3 10z" fill="#ffdf00"/><circle cx="15" cy="10" r="4" fill="#002776"/>',
  },
  DE: {
    nombre: 'Alemania',
    cuerpo:
      '<rect width="30" height="20" fill="#ffce00"/><rect width="30" height="13.33" fill="#dd0000"/><rect width="30" height="6.67" fill="#000"/>',
  },
  FR: {
    nombre: 'Francia',
    cuerpo:
      '<rect width="30" height="20" fill="#ef4135"/><rect width="20" height="20" fill="#fff"/><rect width="10" height="20" fill="#0055a4"/>',
  },
};

/** La bandera de un código, o `undefined` si no la tenemos. */
export function banderaDe(pais: string | undefined): Bandera | undefined {
  return pais && Object.hasOwn(BANDERAS, pais) ? BANDERAS[pais] : undefined;
}
