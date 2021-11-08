import { ErrorResponse } from "../modals/ErrorResponse";

interface Props {
	errors?: ErrorResponse
}

const Errors = ({ errors }: Props) => {
	if(!errors) {
		return null;
	}
	return (
		<div className="alert alert-danger">
			<h4>Oooooops....</h4>
			<ul className="my-0">
				{errors.error.map(err => <li key={err.message}>{err.message}</li>)}
			</ul>
		</div>
	);
}

export default Errors;