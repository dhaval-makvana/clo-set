import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "CLO-SET Connect",
  description: "Storefront with filters and infinite scroll",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
