import React, {Component} from 'react';
import { NavItem, Nav, NavDropdown } from 'react-bootstrap';


class HeaderLinks extends Component{
    render(){
        const notification = (
            <div>
                <i className="fa fa-globe"></i>
                <b className="caret"></b>
                <span className="notification">0</span>
                <p className="hidden-lg hidden-md">Notification</p>
            </div>
        );
        return (
            <div>
                <Nav>
                    <NavDropdown eventKey={2} title={notification} noCaret id="basic-nav-dropdown">
                    </NavDropdown>
                    <NavItem eventKey={3} href="#">
                        <i className="fa fa-search"></i>
                        <p className="hidden-lg hidden-md">Search</p>
                    </NavItem>
                </Nav>
                <Nav pullRight>
                    <NavItem eventKey={3} href="#">Log out</NavItem>
                </Nav>
            </div>
        );
    }
}

export default HeaderLinks;
