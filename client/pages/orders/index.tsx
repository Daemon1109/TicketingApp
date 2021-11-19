import { NextPage } from "next";
import Link from 'next/link';
import { Order } from "../../modals/Order";
import buildAxiosClient from "../api/build-axios-client";

interface Props {
	orders: Order[]
}

const ShowAllOrders: NextPage<Props> = ({ orders }: Props) => {
	const orderListRows = orders.map(order => {
		return (
			<tr key={order.id}>
				<td>{order.ticket.title}</td>
				<td>{order.ticket.price}</td>
				<td>{order.status}</td>
				<td>
					<Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
						<a>View</a>
					</Link>
				</td>
			</tr>
		)
	});
	return (
		<div>
			<h1>My Orders</h1>
			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
						<th>Status</th>
						<th>Link</th>
					</tr>
				</thead>
				<tbody>
					{orderListRows}
				</tbody>
			</table>
		</div>
	);
}

ShowAllOrders.getInitialProps = async (context) => {
	const axiosClient = buildAxiosClient(context);

	const response = await axiosClient.get('/api/orders');

	return {orders: response.data};
}

export default ShowAllOrders;