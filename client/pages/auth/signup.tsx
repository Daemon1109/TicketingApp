import type { NextPage } from "next";
import Router from 'next/router';
import React, { useState } from "react";
import { useRequest } from "../../hooks/use-request";

const Signup: NextPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { doRequest, errors } = useRequest({
		url: '/api/users/signup',
		method: 'POST',
		body: {
			email,
			password
		},
		onSuccess: () => Router.push('/')
	});

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		await doRequest();
	}

	return (
		<form onSubmit={handleFormSubmit}>
			<h1>Signup</h1>
			<div className="form-group">
				<label>Email Address</label>
				<input
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					className="form-control" />
			</div>
			<br />
			<div className="form-group">
				<label>Password</label>
				<input
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					className="form-control" />
			</div>
			<br />
			{errors?.error && (
				<div className="alert alert-danger">
					<h4>Oooooops....</h4>
					<ul className="my-0">
						{errors.error.map(err => <li key={err.message}>{err.message}</li>)}
					</ul>
				</div>
			)}
			<button className="btn btn-primary">Sign Up</button>
		</form>
	);
}

export default Signup;