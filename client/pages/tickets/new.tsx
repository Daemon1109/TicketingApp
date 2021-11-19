import { NextPage } from "next";
import Router from "next/router";
import React, { useState } from "react";

import Errors from "../../components/Errors";
import { useRequest } from "../../hooks/use-request";

const NewTicket: NextPage = () => {
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState('');

	const { doRequest, errors } = useRequest({
		url: '/api/tickets',
		method: 'POST',
		body: {
			title,
			price
		},
		onSuccess: () => Router.push('/')
	});

	const onBlur = () => {
		setPrice(parseFloat(price).toFixed(2));
	}

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		await doRequest();
	}

	return (
		<form onSubmit={handleFormSubmit}>
			<h1>Create New Ticket</h1>
			<div className="form-group">
				<label>Title</label>
				<input
					type="text"
					value={title}
					onChange={e => setTitle(e.target.value)}
					className="form-control" />
			</div>
			<br />
			<div className="form-group">
				<label>Price</label>
				<input
					type="number"
					onBlur={onBlur}
					min="0"
					step="0.01"
					value={price}
					onChange={e => setPrice(e.target.value)}
					className="form-control" />
			</div>
			<br />
			<Errors errors={errors} />
			<button className="btn btn-primary">Create Ticket</button>
		</form>
	);
}

export default NewTicket;