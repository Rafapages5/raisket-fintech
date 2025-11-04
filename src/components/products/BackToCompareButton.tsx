// src/components/products/BackToCompareButton.tsx
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BackToCompareButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCompare = searchParams.get('from') === 'compare';

  if (!fromCompare) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="mb-4 text-primary hover:text-primary/80"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Volver a comparar
    </Button>
  );
}
