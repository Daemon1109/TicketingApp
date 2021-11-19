import type {  NextPage } from 'next'
import Link from 'next/link';

import type { CurrentUser } from '../modals/currentuser'
import type { Ticket } from '../modals/Ticket';
import buildAxiosClient from './api/build-axios-client'

interface Props {
  currentUser?: CurrentUser;
  tickets: Ticket[]
}

const Home: NextPage<Props> = ({ currentUser, tickets }: Props) => {
  const ticketListRows = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    )
  });
  
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketListRows}
        </tbody>
      </table>
    </div>
  );
};

Home.getInitialProps = async (context) => {
  const axiosClient = buildAxiosClient(context);

  const response = await axiosClient.get('/api/tickets');

  // return response.data as Props;
  return {tickets: response.data};
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   return {};
// }

export default Home
