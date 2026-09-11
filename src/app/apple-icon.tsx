import { ImageResponse } from 'next/og';

import { BrandMark, brandMarkFonts } from '@/components/brand-mark';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default async function AppleIcon() {
  return new ImageResponse(<BrandMark size={size.width} />, {
    ...size,
    fonts: await brandMarkFonts(),
  });
}
