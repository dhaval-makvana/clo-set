"use client";

import { CacheProvider, Global, css } from "@emotion/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { createEmotionCache } from "@/lib/emotion-cache";
import { colors, typography } from "@/theme/tokens";

const cache = createEmotionCache();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={cache}>
      <Provider store={store}>
        <Global
          styles={css`
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              font: ${typography.body};
              background: ${colors.background};
              color: ${colors.textPrimary};
            }
          `}
        />
        {children}
      </Provider>
    </CacheProvider>
  );
}
