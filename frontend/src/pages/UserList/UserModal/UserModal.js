import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Alert, Label, Input, FormGroup } from 'reactstrap';
import { updateUser, setUpdated, addUser } from '../../../redux/actions/userActions'
import { modalInputs } from '../../variables'

const UserUpdate = ({ openUserModal, userModal, user, onChange, addMode }) => {
  const dispatch = useDispatch()

  const { message, id } = useSelector(state => state.errorReducer)
  const { updated } = useSelector(state => state.userReducer)

  useEffect(() => {
    if (updated) {
      dispatch(setUpdated(false))
      openUserModal()
    }
  }, [updated])

  const onSubmit = e => {
    e.preventDefault()
    if (addMode) {
      console.log(user)
      dispatch(addUser(user))
    } else {
      dispatch(updateUser(user))
    }
  }

  if (!user) return null
  return (
    <div>
      <Modal isOpen={userModal} toggle={() => openUserModal()}>
        <ModalHeader toggle={() => openUserModal()}>{addMode ? 'Create New Member' : 'Update Member'}</ModalHeader>
        <Form onSubmit={onSubmit}>
          <ModalBody>
            {id === 'USER_FAIL' && < Alert color='danger'>{typeof message === 'object' ? message.message : message}</Alert>}
            {modalInputs.map(({ title, type, name, id = null, required = false, options = [] }) => {
              if (addMode && !required) return null
              return <FormGroup>
                <Label>{title}</Label>
                <Input
                  type={type}
                  value={id && user[id] ? user[id][name] : user[name]}
                  name={name}
                  id={id}
                  required={required}
                  onChange={onChange}
                >
                  {options.map((e, i) => <option key={e.value + i} value={e.value}>{e.name}</option>)}
                </Input>
              </FormGroup>
            })}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type='submit'>{addMode ? 'Create Member' : 'Save'}</Button>{' '}
            <Button color="secondary" onClick={() => openUserModal()}>Close</Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div >
  );
}

export default UserUpdate;