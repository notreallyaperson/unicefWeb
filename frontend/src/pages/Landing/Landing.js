import React, { Fragment } from 'react';
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { Row, Col } from 'reactstrap'

//Import Components


function Landing() {
    const { isAuthenticated } = useSelector(state => state.authReducer)

    // Redirect if logged in
    if (isAuthenticated) {
        return <Redirect to='/userlist' />;
    }

    return (
        <Fragment>
            <Row>
                <Col ></Col>
                <Col></Col>
            </Row>
        </Fragment>
    );
}

export default Landing;