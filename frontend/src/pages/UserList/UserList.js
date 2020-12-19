import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Button, Table } from 'reactstrap'

import { getUsers } from '../../redux/actions/userActions'

//Import Variables
import { defaultUser } from '../variables'

//Import Components
import UserTable from './UserTable/UserTable'
import UserModal from './UserModal/UserModal'

function UserList() {
    const dispatch = useDispatch()

    const [user, setUser] = useState(defaultUser)
    const [addMode, setAddMode] = useState(false)

    useEffect(() => {
        dispatch(getUsers())
    }, [])

    const [userModal, setUserModal] = useState(false)
    const openUserModal = (user = defaultUser, addMode = false) => {
        setUserModal(!userModal)
        setUser(user)
        setAddMode(addMode)
    }

    const onChange = e => {
        var object = { ...user }
        const { id, value, name } = e.target
        if (id) {
            // To create an object if it doesn't exist yet
            if (!object[id]) object[id] = {}
            object[id] = { ...object[id], [name]: value }
        } else {
            object[name] = value
        }
        setUser(object)
    }


    return (
        <Fragment>
            <Button onClick={() => openUserModal(defaultUser, true)}>Add User</Button>
            <br></br>
            <br></br>
            <UserModal
                openUserModal={openUserModal}
                userModal={userModal}
                user={user}
                onChange={onChange}
                addMode={addMode}
            />
            <UserTable
                openUserModal={openUserModal}
            />
        </Fragment>
    );
}

export default UserList;