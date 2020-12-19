import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux'
import { NavLink } from 'reactstrap';
import { logout } from '../../../redux/actions/authActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

const Logout = props => {
    const dispatch = useDispatch()

    return (
        <Fragment>
            <NavLink onClick={() => dispatch(logout())} href="#">
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </NavLink>
        </Fragment>
    );
}

export default Logout