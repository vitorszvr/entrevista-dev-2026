'use client';

import Image, { ImageProps } from 'next/image';
import { useCart } from '@/contexts/CartContext';

interface ProductImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  product: {
    id: number;
    image: string;
    name: string;
  };
  alt?: string;
}

export function ProductImage({ product, alt, ...props }: ProductImageProps) {
  const { showLocalImages } = useCart();

  const src = showLocalImages ? `/${product.id}.png` : product.image;

  return <Image src={src} alt={alt || product.name} {...props} />;
}
