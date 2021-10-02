import type { AppProps } from 'next/app';
import '../src/styles/styles-core.scss';
import withApollo from '../lib/withApollo';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withApollo(MyApp);
