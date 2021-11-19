import { CurrentUser } from "../modals/currentuser";
import Link from 'next/link';

interface Props {
	currentUser?: CurrentUser
}

const Header: React.FC<Props> = ({ currentUser }: Props) => {
	const links = [
		!currentUser && { label: 'Sign Up', href: '/auth/signup' },
		!currentUser && { label: 'Sign In', href: '/auth/signin' },
		currentUser && { label: 'Sell Ticket', href: '/tickets/new' },
		currentUser && { label: 'My Orders', href: '/orders' },
		currentUser && { label: 'Sign Out', href: '/auth/signout' }
	]
	.filter(linkConfig => linkConfig)
	.map(({label, href}:any) => {
		return (
			<li key={href} className="nav-item">
				<Link href={href}>
					<a className="nav-link">
						{label}
					</a>
				</Link>
			</li>
		);
	});

	return (
		<nav className="navbar navbar-dark bg-dark">
			<Link href="/">
				<a className="navbar-brand">Ticketing</a>
			</Link>

			<div className="d-flex justify-content-end">
				<ul className="nav d-flex align-itens-center">
					{links}
				</ul>
			</div>
		</nav>
	);
}

export default Header;