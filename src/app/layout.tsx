'use client';// src/app/layout.tsx
import { Inter } from 'next/font/google';
import 'antd/dist/reset.css'; // Ant Design v5를 사용하는 경우, v4는 'antd/dist/antd.css'
import './globals.css';
import MainLayout from '@/component/layout/layout'; // 컴포넌트 경로가 다를 수 있으니 확인하세요.
import { createGlobalStyle, ThemeProvider } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    /* Add any global styles here */
    body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    }
`;

const theme = {
  colors: {
    primary: '#0070f3',
    info: '#ffab3e',
    secondary: '#8c8c8c',
  },
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body className={inter.className}>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <MainLayout>{children}</MainLayout>
    </ThemeProvider>
    </body>
    </html>
  );
}
