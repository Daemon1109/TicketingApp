import '../styles/globals.css'
import App, { AppInitialProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css'         // Add bootstrap support
import type { AppContext, AppProps } from 'next/app'
import buildAxiosClient from './api/build-axios-client'
import { CurrentUser } from '../modals/currentuser';
import Header from '../components/Header'

interface Props {
  currentUser?: CurrentUser
}

// TODO change the AppProps interface to take current user as an input
function MyApp({ Component, pageProps, currentUser }: AppProps & Props) {
  return (
    <div>
      <Header currentUser={currentUser}></Header>
      <Component {...pageProps} />
    </div>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const axiosClient = buildAxiosClient(appContext.ctx);

  const response = await axiosClient.get('/api/users/currentuser');
  const currentUser = (response.data.currentUser) ? (
    response.data.currentUser
  ) : undefined;

  const appProps: AppInitialProps = await App.getInitialProps(appContext);   // Using Next provided App to check & call getInitialProps methods of pages
  
  // const pageProps = (appContext.Component.getInitialProps) ? (
  //   await appContext.Component.getInitialProps(appContext.ctx)
  // ) : (
  //   {}
  // );                                              // Manually checking & calling if a page have getInitialProps
      
  return {...appProps, currentUser};
  // return {pageProps, currentUser};
}

export default MyApp
