import { NextPage } from "next";
import Router from 'next/router';
import { useEffect, useState } from "react";

import StripeCheckout from 'react-stripe-checkout';

import { CurrentUser } from "../../modals/currentuser";
import { Order } from "../../modals/Order";
import { useRequest } from "../../hooks/use-request";
import buildAxiosClient from "../api/build-axios-client";

import Errors from '../../components/Errors';

interface Props {
	currentUser?: CurrentUser;
	order: Order;
}

const ShowOrder: NextPage<Props> = ({ currentUser, order }: Props) => {
	const [ timeLeft, setTimeLeft ] = useState<number>(0);
	const { doRequest, errors } = useRequest({
		url: '/api/payments',
		method: 'POST',
		body: {
			orderId: order.id
		},
		onSuccess: () => Router.push('/orders')
	});

	if(order.status === "complete") {
		return (
			<div>
				You have successfully ordered your {order.ticket.title} ticket!
				<br />
				Have a great time...... 😎 
			</div>
		)
	}

	if(order.status === "cancelled") {
		return (
			<div>
				<h2>Oops!</h2>
				<h3>Looks like your order has been cancelled!! 😦</h3>
				
				<h5>You can always create a new order too😉</h5>
			</div>
		)
	}

	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();
			setTimeLeft(Math.round(msLeft / 1000));
		}

		findTimeLeft();
		const timerId = setInterval(findTimeLeft, 1000);

		return () => {
			clearInterval(timerId);
		}
	}, []);

	if (timeLeft <= 0) {
		return (
			<div>
				Order expired!
			</div>
		);
	}

	return (
		<div>
			Time left to pay: {timeLeft} seconds
			<StripeCheckout
				token={({ id }) => doRequest({token: id})}
				stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!}
				amount={order.ticket.price * 100}
				email={currentUser!.email}
				currency="INR"
			/>
			<Errors errors={errors} />
		</div>
	);
}

ShowOrder.getInitialProps = async (context) => {
	const { orderId } = context.query;

	const axiosClient = buildAxiosClient(context);

	const response = await axiosClient.get(`/api/orders/${orderId}`);

	return { order: response.data };
}

export default ShowOrder;