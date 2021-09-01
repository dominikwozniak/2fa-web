import type { AppProps } from 'next/app';
import '../styles/styles-core.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
