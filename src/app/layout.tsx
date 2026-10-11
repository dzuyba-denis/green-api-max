import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Веб-версия MAX | GREEN-API',
  description: 'Пользовательский интерфейс мессенджера MAX для отправки и получения сообщений через сервис GREEN-API',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="h-full overflow-hidden bg-[#edeef2] text-[#060708]">
        {children}
      </body>
    </html>
  );
}
