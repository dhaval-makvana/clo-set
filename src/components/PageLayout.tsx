"use client";

import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
  max-width: 1100px;
  margin: 24px auto;
  padding: 0 16px;
  display: grid;
  gap: 16px;
`;

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Container>{children}</Container>;
}
