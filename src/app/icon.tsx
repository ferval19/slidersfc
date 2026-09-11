import { ImageResponse } from 'next/og';

import { BrandMark, brandMarkFonts } from '@/components/brand-mark';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default async function Icon() {
  return new ImageResponse(<BrandMark size={size.width} />, {
    ...size,
    fonts: await brandMarkFonts(),
  });
}
