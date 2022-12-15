import React from 'react';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import { GlobalContext } from '../context/GlobalState';

function Register() {
    let navigate = useNavigate();
    const { addVlog } = useContext(GlobalContext);
  
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onSubmit = (e) => {
      e.preventDefault();
      const newNote = {
        firstName, 
        lastName,
        username,
        password
      };
  
      const request = new Request("http://localhost:8080/user", {
        method: 'POST',
        body: JSON.stringify(newNote),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      });
  
      fetch(request).then((response) => {
        if (response.ok) {
            addVlog(newNote)
            navigate("/login")
        }
        return response.text()
        .then((text) => { 
          const msg = JSON.parse(text)
          const error = msg.message
          setError(error)
        })
      })
    };
  
  return (
    <div className='bg-light border border-white' style={{height:'92.5vh'}}>
      <Card className="mt-3 text-center m-auto py-3 mt-5 pb-0" style={{ width: '40rem'}}>
        <Card.Title className='py-3'><h1>Sign Up</h1></Card.Title>
        <Card.Body>
            {error ? (
              <div className="alert alert-danger" role="alert">{error}</div>
            ):<></>}
            <form onSubmit={onSubmit}>
            <div className='form-group py-1'>
                <label className="control-label">First Name</label>
                <input            
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="form-control"
                    required
                />
            </div>
            <div className='form-group py-1'>
                <label className="control-label">Last Name</label>
                <input            
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="form-control"
                    required
                />
            </div>
            <div className='form-group py-1'>
                <label className="control-label">Username</label>
                <input            
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="form-control"
                    required
                />
            </div>
            <div className='form-group py-1'>
                <label className="control-label">Password</label>
                <input            
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="form-control"
                    required
                />
                <div id="passwordinstruction" className="form-text">
                  Must have characters greater than 12 and without any number and special character.
                </div>
            </div>
            <button className='m-3 bg-primary rounded p-2'>Create Account</button>
            </form>
        </Card.Body>
        <Card.Footer>
            <Card.Link href="/login">
                Already have an account? Sign in here
            </Card.Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Register;