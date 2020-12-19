import React, { Fragment } from 'react';
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom';

//Import Components


function Landing() {
    const { isAuthenticated } = useSelector(state => state.authReducer)

    // Redirect if logged in
    if (isAuthenticated) {
        return <Redirect to='/userlist' />;
    }

    return (
        <Fragment>
            <center>
                <br />
                <br />
                <br />
                <br />
                <br />
                <h1>Eventual Browser page</h1>
            </center>
        </Fragment>
    );
}

export default Landing;