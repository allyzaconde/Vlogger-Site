import React from 'react';
import { useContext, useEffect } from 'react';
import { Link } from "react-router-dom";
import { GlobalContext } from '../context/GlobalState';
import { AuthContext } from "../context/AuthState";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import test from '../images/test.png'

function UserProfile(){
    const { notes, addAllVlogs } = useContext(GlobalContext)
    const { state } = useContext(AuthContext);

    useEffect(() => {
        if(state.isLoggedIn){
          getNotes();
        }
        // eslint-disable-next-line
      }, [state.isLoggedIn]); 
    
      async function getNotes() {
        await fetch("http://localhost:8080/blog", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${state.token}`,
            "User": state.userId,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            addAllVlogs(data.data, state.username);
          })
          .catch((error) => {
            console.log(error);
          });
      }

    function checkDate(noteDateCreated){
        const currDate = new Date().getTime();
        const diffTime = Math.abs(currDate - noteDateCreated);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays
      }
    
      function checkToday(noteDateCreated){
        const currDate = new Date();
        const noteDate = new Date(noteDateCreated);
        if(
          noteDate.getDate() === currDate.getDate() &
          noteDate.getMonth() === currDate.getMonth() &&
          noteDate.getYear() === currDate.getYear()
        ){
          return true
        }
        return false
      }

    return(
        <div className='bg-light border border-white pb-5' style={{height: '100%'}}>
            <Col className="text-center">
                <Row className="col-2 pb-2 p-5 m-auto">
                    <img src={test} className="rounded-circle" alt='test'/>
                </Row>
                <Row>
                    <div className='text-primary'>{state.username}</div>
                </Row>
            </Col>
            { notes.length > 0 ? (
                <div>
                    {notes.map((note) => (
                        <div key={note.blogId}>
                            <Container className="float-center my-5" style={{ width: '40rem' }}>
                                <Row>
                                <Col>
                                    <Card className="m-auto">  
                                    <Card.Body>
                                        <Card.Title>
                                        <b>{note.title}</b>
                                        </Card.Title>
                                        <Card.Text>
                                        {note.summary}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer className="text-muted">
                                        {checkDate(note.dateCreated) === 1 ? (
                                        <div>
                                            {checkToday(note.dateCreated) ? (
                                            <div>today</div>
                                            ): <div>yesterday</div>
                                            }
                                        </div>
                                        ) : <div>{checkDate(note.dateCreated)} days ago</div>
                                        }
                                    </Card.Footer>
                                    <Card.Body>
                                        <Link to={`/detail/${note.blogId}`}>
                                            replies here
                                        </Link>
                                    </Card.Body>
                                    </Card>
                                </Col>
                                </Row>
                            </Container>
                        </div>
                    ))}
                </div>
            ):<></>}
        </div>
    )
}

export default UserProfile;