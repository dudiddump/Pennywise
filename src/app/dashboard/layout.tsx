import React from 'react';

// Layout ini hanya meneruskan konten (children) tanpa menambahkan elemen UI lain.
// Ini mencegah layout bersarang yang menyebabkan sidebar ganda.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
