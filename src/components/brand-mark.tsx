import { displayFont } from '@/lib/og-fonts';

/**
 * El icono de la marca: SFC sobre la pizarra, la S en tiza y FC en amarillo.
 * Lo usan src/app/icon.tsx y src/app/apple-icon.tsx, que sólo cambian el
 * tamaño.
 */
export function BrandMark({ size }: { size: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0b241f',
        color: '#f2efe4',
        fontFamily: 'Display',
        // Ajustado a ojo: con 0.72 las tres letras se salían del lienzo por
        // los lados. Big Shoulders es condensada, pero no tanto.
        fontSize: size * 0.56,
        lineHeight: 1,
      }}
    >
      <span>S</span>
      <span style={{ color: '#ffd24a' }}>FC</span>
    </div>
  );
}

export async function brandMarkFonts() {
  return [
    { name: 'Display', data: await displayFont(), weight: 900 as const, style: 'normal' as const },
  ];
}
