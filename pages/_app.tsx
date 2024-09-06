import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ImageProvider } from '@/context/ImageContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ImageProvider>
      <Component {...pageProps} />
    </ImageProvider>
  );
}
