import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ImageProvider } from '@/context/ImageContext';
import { WalletProvider } from '@/helpers/WalletProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <ImageProvider>
        <Component {...pageProps} />
      </ImageProvider>
    </WalletProvider>
  );
}
