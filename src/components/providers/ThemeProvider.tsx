'use client'

import ConfigProvider from 'antd/es/config-provider';
import { theme } from 'antd';
import { ReactNode } from "react";
import { Lexend_Deca } from "next/font/google";

const { darkAlgorithm } = theme;
const lexendDeca = Lexend_Deca({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

interface ThemeProviderProps {
  children: ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#faa800',
          fontFamily: lexendDeca.style.fontFamily,
        },
        algorithm: darkAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}