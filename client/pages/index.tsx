import type { NextPage } from 'next'
import type { CurrentUser } from '../modals/currentuser'
import buildAxiosClient from './api/build-axios-client'

interface Props {
  currentUser?: CurrentUser;
}

const Home: NextPage<Props> = ({ currentUser }: Props) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT singed in</h1>;
};

Home.getInitialProps = async (context) => {
  const axiosClient = buildAxiosClient(context);

  const response = await axiosClient.get('/api/users/currentuser');

  return response.data as Props;
}

export default Home
