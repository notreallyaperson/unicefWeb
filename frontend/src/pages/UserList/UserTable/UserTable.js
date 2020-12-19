import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Table } from 'reactstrap'
import { deleteUser } from '../../../redux/actions/userActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import ExportCSV from './ExportCSV/ExportCSV'


import './UserTable.css'

//Import Components


function UserTable({ openUserModal }) {
    const dispatach = useDispatch()
    const { users } = useSelector(state => state.userReducer)

    const onDelete = (id) => {
        var confirm = window.confirm('Permanently delete this Member?')
        if (confirm) dispatach(deleteUser(id))
    }

    return (
        <Fragment>
            <Table id='userList' size="sm" responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Permission Level</th>
                        <th>Status</th>
                        <th style={{ maxWidth: '70px', minWidth: '70px' }}>
                            <div style={{ display: 'inline', marginTop: '-10px' }}>
                                <ExportCSV table='userList' filename={`User List ${new Date()}`} />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => {
                        var personalDetailsFlag = user.personalDetails ? true : false
                        var companyDetailsFlag = user.companyDetails ? true : false
                        return <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.email}</td>
                            <td>{user.permissionLevel}</td>
                            <td>{user.status}</td>
                            <td>
                                <span
                                    className='editButton'
                                    onClick={() => openUserModal(user)}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </span>{" "}
                                <span
                                    className='deleteButton'
                                    onClick={() => onDelete(user._id)}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </span>
                            </td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </Fragment >
    );
}

export default UserTable;