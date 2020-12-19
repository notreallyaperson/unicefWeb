import React, { useEffect, Fragment } from 'react';
import { loadUser } from '../../redux/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NavBar from '../NavBar/Navbar';
import Landing from '../../pages/Landing/Landing';

const requireAuth = (AuthComponent, requireAuth, admin, hidden) => {
	const Authenticate = (props) => {
		const dispatch = useDispatch();
		const auth = useSelector((state) => state.authReducer);
		const { isAuthenticated, isLoading, user } = auth;

		useEffect(() => {
			dispatch(loadUser());
		}, []);

		if (user && user.user.status !== 'active')
			return (
				<Fragment>
					<NavBar hidden={hidden} />
					<br />
					<h2 style={{ textAlign: 'center' }}>User Disabled</h2>
				</Fragment>
			);

		if (admin) {
			if (user && user.user.permissionLevel !== 'Admin') {
				return <Redirect to='/'></Redirect>;
			}
		}

		return (
			<Fragment>
				<div style={{ position: 'sticky', top: '0px', zIndex: '5' }}>
					<NavBar hidden={hidden} />
				</div>
				<br></br>
				{isAuthenticated || !requireAuth ? (
					<AuthComponent {...props} />
				) : (
						!isLoading && <Landing />
					)}
			</Fragment>
		);
	};
	return Authenticate;
};

export default requireAuth;
