"use client";

import { CacheProvider, Global, css } from "@emotion/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { createEmotionCache } from "@/lib/emotion-cache";

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
              font-family: Inter, system-ui, Arial;
              background: #f7f7fb;
            }
          `}
        />
        {children}
      </Provider>
    </CacheProvider>
  );
}
