import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    NavLink,
    Alert
} from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'

//Import Redux Actions
import { login } from '../../../redux/actions/authActions'
import { Redirect } from 'react-router-dom';


const LoginModal = props => {
    const [modal, setModal] = useState()
    const [errorMessage, setErrorMessage] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch();
    const { isAuthenticated, authLoading } = useSelector((state) => state.authReducer);
    const { message, id } = useSelector((state) => state.errorReducer);

    const [visiblePassword, setVisiblePassword] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        // create a user object
        const user = {
            email: email.toLowerCase(),
            password,
        };
        //Attempt to Register
        dispatch(login(user));
    };

    // If parameters are provided use email
    useEffect(() => {
        const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString).get('email');
        setEmail(urlParams);
        if(urlParams){
            toggle()
        }
    }, [])

    // Redirect if logged in
    if (isAuthenticated) {
        return <Redirect to='/userlist' />;
    }

    // Function to open and close login modal
    const toggle = () => {
        setModal(!modal)
    }

    return (
        <div>
            <NavLink
                onClick={toggle}
                href="#"
            >
                <FontAwesomeIcon icon={faSignInAlt} /> Login
            </NavLink>

            <Modal
                isOpen={modal}
                toggle={toggle}
            >
                <ModalHeader
                    toggle={toggle}
                >
                    Login
                </ModalHeader>
                <ModalBody>
                    {message && id === 'LOGIN_FAIL' && <Alert color="danger">{message.message}</Alert>}
                    <Form onSubmit={onSubmit}>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                defaultValue={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password" >Passwort</Label>
                            <Input
                                type="password"
                                defaultValue={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </FormGroup>
                        {/* <a href="/resetpassword" >Passwort vergessen</a> */}
                        <Button
                            color="dark"
                            style={{ marginTop: "2rem" }}
                            block
                            disabled={authLoading}
                        >
                            Login
                        </Button>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default LoginModal