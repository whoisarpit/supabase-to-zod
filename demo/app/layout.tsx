import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "Supabase to Zod Type Generator",
  description: "Convert Supabase types to Zod schemas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="dark:bg-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
