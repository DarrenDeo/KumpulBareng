'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Kita tidak perlu lagi mengimpor tipe yang menyebabkan error.
// Kita bisa mendefinisikan props yang dibutuhkan secara langsung.
export function ThemeProvider({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}