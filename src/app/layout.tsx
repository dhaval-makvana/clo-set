import type { Metadata } from "next";
import Providers from "./providers";
import EmotionRootStyleRegistry from "@/app/emotion-ssr";

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
        <EmotionRootStyleRegistry>
          <Providers>{children}</Providers>
        </EmotionRootStyleRegistry>
      </body>
    </html>
  );
}
