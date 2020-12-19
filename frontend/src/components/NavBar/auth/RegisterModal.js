import React, {useState} from 'react';
import axios from 'axios'
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
import { Redirect } from 'react-router-dom'

const RegisterModal = props => {
    const [modal, setModal] = useState()
    const [redirect, setRedirect] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    // To Redirect to the home page when login 2 paths in which causes an error
    if(redirect){
        return <Redirect to={{
            pathname: '/',
            state: { requireRefresh: true }
        }} /> 
    }

    // Function to open and close login modal
    const toggle = () => {
        setModal(!modal)
    }

    // Login Function
    const submitRegister = async e => {
        e.preventDefault()
        const registerDetails = {
            name,
            email,
            password,
            password2
        }
        await axios.post('api/auth/register',registerDetails)
        .then(res => {
            toggle()
            localStorage.setItem('token', res.data.token)
            props.setAuthenticated(true)
        })
        .catch(err => {
            localStorage.clear()
            setErrorMessage(err.response.data.message)
        })
    }

        return (
            <div>
                <NavLink
                    onClick={toggle}
                    href = "#"
                >
                    Register
                </NavLink>

                <Modal
                    isOpen={modal}
                    toggle={toggle}
                >
                    <ModalHeader
                        toggle={toggle}
                    >
                        Register
                    </ModalHeader>
                    <ModalBody>
                        {errorMessage&&<Alert color="danger">{errorMessage}</Alert>}
                        <Form onSubmit={submitRegister}>
                            <FormGroup>
                                <Label>Full Name</Label>
                                <Input 
                                    type = "text"
                                    placeholder = "Full Name"
                                    defaultValue={name}
                                    onChange = {e => setName(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Email</Label>
                                <Input 
                                    type = "email"
                                    placeholder = "Requires Unique Email"
                                    defaultValue={email}
                                    onChange = {e => setEmail(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for = "password" >Password</Label>
                                <Input 
                                    type = "password"
                                    placeholder = "Password"
                                    defaultValue={password}
                                    onChange = {e => setPassword(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for = "password2" >Confirm Password</Label>
                                <Input 
                                    type = "password"
                                    placeholder = "Confirm Password"
                                    defaultValue={password2}
                                    onChange = {e => setPassword2(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <Button
                                color= "dark"
                                style = {{marginTop: "2rem"}}
                                block
                            >
                                Register
                            </Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        )
}

export default RegisterModal