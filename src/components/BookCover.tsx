'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

const FALLBACK =
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&auto=format&fit=crop';

interface BookCoverProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function BookCover({ src, alt, fill, className, sizes, priority }: BookCoverProps) {
  const imageSrc = src && src.length > 10 ? src : FALLBACK;
  const useNativeImg =
    imageSrc.startsWith('data:') || imageSrc.startsWith('/uploads/');

  if (useNativeImg) {
    if (fill) {
      return (
        <img
          src={imageSrc}
          alt={alt}
          className={cn('absolute inset-0 h-full w-full object-cover', className)}
        />
      );
    }
    return <img src={imageSrc} alt={alt} className={className} />;
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
