import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { AuthContext } from "../context/AuthState"
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';

function Header(){
    const { state, logout, loading } = useContext(AuthContext);
    let navigate = useNavigate();

    const onLogout = (e) => {
        e.preventDefault();
        const request = new Request(
            "http://localhost:8080/logout",
            {
              method: 'GET',
              headers: new Headers({
                "Authorization": `Bearer ${state.token}`,
                "User": state.userId,
              }),
            }
          );
        fetch(request)
        .catch((error) => {
            console.log(error);
        });

        logout();
        navigate("/login")
    }

    const onLoading = (e) => {
        e.preventDefault(); 
        loading();
        navigate("/user")
    }

    return (
        <Navbar bg="primary" expand="lg">
            <Container>
                <Navbar.Brand href="/">Vlogger-Site</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/user" onClick={onLoading}>Profile</Nav.Link>
                </Nav>
                { state.isLoggedIn ?
                    <div className='row align-items-end'>
                        <Nav.Link href="/user" onClick={onLoading} className="col px-3">{state.username}</Nav.Link> 
                        <Nav.Link href="#" onClick={onLogout} className="col px-3">Logout </Nav.Link> 
                    </div>: 
                    <Nav.Link href="/login" className="align-items-end">Login</Nav.Link>
                }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;