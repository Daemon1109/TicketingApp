import { NextPage } from "next";
import Router from 'next/router';

import { useRequest } from "../../hooks/use-request";
import Errors from "../../components/Errors";
import { Ticket } from "../../modals/Ticket";
import buildAxiosClient from "../api/build-axios-client";

interface Props {
	ticket: Ticket;
}

const ShowTicket: NextPage<Props> = ({ ticket }: Props) => {
	const { doRequest, errors } = useRequest({
		url: '/api/orders',
		method: 'POST',
		body: {
			ticketId: ticket.id
		},
		onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
	});

	return (
		<div>
			<h1>{ticket.title}</h1>
			<h4>Price: {ticket.price}</h4>
			<br />
			<br />
			<Errors errors={errors} />
			<button className="btn btn-primary" onClick={(e) => doRequest()}>Purchase</button>
		</div>
	);
}

ShowTicket.getInitialProps = async (context) => {
	const { ticketId } = context.query;

	const axiosClient = buildAxiosClient(context);

	const response = await axiosClient.get(`/api/tickets/${ticketId}`);

	return { ticket: response.data };
}

export default ShowTicket;