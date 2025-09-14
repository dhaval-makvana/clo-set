"use client";
import { Provider } from "react-redux";
import { store } from "../store";
import { Global, css } from "@emotion/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
