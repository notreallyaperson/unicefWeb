import React, { useState, Fragment } from 'react';
import { useSelector } from 'react-redux'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import LoginModal from './auth/LoginModal'
import RegisterModal from './auth/RegisterModal'
import Logout from './auth/Logout'

const NavBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const auth = useSelector((state) => state.authReducer);
  const { isAuthenticated, isLoading, user } = auth;
  const isAdmin = user && user.user.permissionLevel && user.user.permissionLevel === 'Admin'

  return (
    <Fragment>
      <Navbar color="light" light expand="md">
        {/* <NavbarBrand href="/"><img src={require('')} style={{height: '30px'}}/></NavbarBrand> */}
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {
              isAuthenticated // TO display different Navbars for each state
                ? <Fragment>
                  {isAdmin && <Fragment>
                    <NavItem>
                      <NavLink href="/userlist">Member List</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="/statistics">Statistics</NavLink>
                    </NavItem>
                  </Fragment>}
                  <NavItem>
                    <Logout />
                  </NavItem>
                </Fragment>
                : !isLoading && <Fragment>
                  <NavItem>
                    <LoginModal />
                  </NavItem>
                </Fragment>
            }

          </Nav>
        </Collapse>
      </Navbar>
    </Fragment>
  );
}

export default NavBar;