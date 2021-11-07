import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'         // Add bootstrap support
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
