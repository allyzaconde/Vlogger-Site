import React from 'react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthState"

import Card from 'react-bootstrap/Card';

function Login() {
  let navigate = useNavigate();
  const { login } = useContext(AuthContext)
  const [loginDetails, setLogin] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
 
  const onSubmit = (e) => {
    e.preventDefault();
    const request = new Request(
      "http://localhost:8080/login",
      {
        method: 'POST',
        body: JSON.stringify(loginDetails),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }
    );
    fetch(request)
      .then((response) => {
        if (response.ok) {
          return response.text()
          .then((text) => {
            const data = JSON.parse(text)
            const token = data.data
            const userId = data.userId
            const username = loginDetails.username
            login(userId, token, username)
            navigate("/")
          })
        }
        return response.text()
        .then((text) => {
          const msg = JSON.parse(text)
          const error = msg.message
          setError(error)
        })
      })
      .catch((error) => {
          console.log(error);
      });
  }

  const handleOnChange = (userKey, newValue) =>
  setLogin({ ...loginDetails, [userKey]: newValue });

  return (
    <div className='bg-light border border-white' style={{height:'92.5vh'}}>
      <Card className="mt-3 text-center m-auto py-3 mt-5 pb-0" style={{ width: '40rem'}}>
        <Card.Title className='py-3'><h1>Sign In</h1></Card.Title>
        <Card.Body>
          {error ? (
              <div className="alert alert-danger" role="alert">{error}</div>
            ):<></>}
          <form onSubmit={onSubmit}>
            <div className='form-group py-1'>
              <label>Username</label>
              <input            
                type="text"
                onChange={(e) => handleOnChange('username', e.target.value)}
                placeholder="Enter Username"
                className="form-control"
                required
              />
            </div>
            <div className='form-group py-1'>
              <label>Password</label>
              <input            
                type="password"
                onChange={(e) => handleOnChange('password', e.target.value)}
                placeholder="Enter Password"
                className="form-control"
                required
              />
            </div>
            <button className='m-3 bg-primary rounded p-2'>Login</button>
          </form>
        </Card.Body>
        <Card.Footer>
          <Card.Link href="/register">
            Don't have an account? Sign up here
          </Card.Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Login;