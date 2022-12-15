import React from 'react';
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState"
import { AuthContext } from "../context/AuthState"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'

import test from '../images/test.png'


function NotesList() {  
  const { notes, addAllVlogs, removeVlog } = useContext(GlobalContext)
  const { state, logout } = useContext(AuthContext)

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
        'User': state.userId,
      },
    })
      .then((response) => {
        if(!response.ok){
          logout();
          return response.text();
        }
        return response.json()
        .then((data) => {
          addAllVlogs(data.data);
        })
        .catch((error) => {
          console.log(error);
        });
      })
  }

  async function deleteNotes(blogId) {
    await fetch("http://localhost:8080/blog/" + blogId, {
      method: "DELETE",
      headers: {
        'Content-Type': "application/json",
        "Authorization": `Bearer ${state.token}`,
        'User': state.userId,
      },
    })
      .then((response) => {
        if(response.ok){
          removeVlog(blogId);
          getNotes();
          return response.text()
        }
        return response.text()
        .then((text) => {
            const msg = JSON.parse(text)
            const error = msg.message
            window.alert(error);
        })
      })
      .catch((error) => {
        console.log(error);
      })
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

  return (
      <div className='bg-light border border-white pb-5' style={{height: '100%'}}>
        <div className="fixed-bottom m-5 p-1">
          <Link to="/create">
            <button type="submit" className="float-end bg-primary rounded-circle text-white p-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#000000" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19">
                </line>
                <line x1="5" y1="12" x2="19" y2="12">
                </line>
              </svg>
            </button>
          </Link>
        </div>
        <div>
          { notes.length > 0 ? (
            <div className="justify-content-center">
              {notes.map((note) => (
                <div key={note.blogId}>
                  <Container className="float-center my-5" style={{ width: '60rem' }}>
                    <Row>
                      <Col className='col align-self-center'>
                        <Row>
                          <img src={test} className="rounded-circle" alt='test'/>
                        </Row>
                        <Row className="row justify-content-center text-primary">
                          {note.username}
                        </Row>
                      </Col>
                      <Col>
                        <Card style={{ width: '50rem'}}>  
                          <Card.Body>
                            <Card.Title>
                              <b>{note.title}</b>
                            </Card.Title>
                            <Card.Text>
                              {note.summary}
                            </Card.Text>
                            <Col className="d-flex justify-content-end">
                              <div className='px-1'>
                                <Link to ={`/detail/${note.blogId}`}>
                                  <Button variant="primary" className="mr-5 text-white">
                                    <svg
                                      width="20"
                                      height="21"
                                      viewBox="0 0 15 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M7.5 9.65C7.89783 9.65 8.27936 9.49196 8.56066 9.21065C8.84196 8.92935 9 8.54782 9 8.14999C9 7.75217 8.84196 7.37064 8.56066 7.08933C8.27936 6.80803 7.89783 6.64999 7.5 6.64999C7.10218 6.64999 6.72064 6.80803 6.43934 7.08933C6.15804 7.37064 6 7.75217 6 8.14999C6 8.54782 6.15804 8.92935 6.43934 9.21065C6.72064 9.49196 7.10218 9.65 7.5 9.65Z"
                                        fill="#373336"
                                      />
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M0.343506 8.14999C1.29901 5.10724 4.14151 2.89999 7.50001 2.89999C10.8585 2.89999 13.701 5.10724 14.6565 8.14999C13.701 11.1927 10.8585 13.4 7.50001 13.4C4.14151 13.4 1.29901 11.1927 0.343506 8.14999ZM10.5 8.14999C10.5 8.94564 10.1839 9.70871 9.62133 10.2713C9.05872 10.8339 8.29566 11.15 7.50001 11.15C6.70436 11.15 5.94129 10.8339 5.37868 10.2713C4.81608 9.70871 4.50001 8.94564 4.50001 8.14999C4.50001 7.35434 4.81608 6.59128 5.37868 6.02867C5.94129 5.46606 6.70436 5.14999 7.50001 5.14999C8.29566 5.14999 9.05872 5.46606 9.62133 6.02867C10.1839 6.59128 10.5 7.35434 10.5 8.14999Z"
                                        fill="#373336"
                                      />
                                    </svg>
                                  </Button>
                                </Link>
                              </div>
                              <div className='px-1'>
                                <Link to={`/edit/${note.blogId}`}>
                                  <Button variant="primary" className="mr-5 text-white">
                                    <svg
                                      width="20"
                                      height="21"
                                      viewBox="0 0 15 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M13.0605 2.58949C12.7792 2.30829 12.3977 2.15031 12 2.15031C11.6023 2.15031 11.2208 2.30829 10.9395 2.58949L5.25 8.27899V10.4H7.371L13.0605 4.71049C13.3417 4.4292 13.4997 4.04774 13.4997 3.64999C13.4997 3.25225 13.3417 2.87079 13.0605 2.58949Z"
                                        fill="#373336"
                                      />
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M1.5 5.14999C1.5 4.75217 1.65804 4.37064 1.93934 4.08933C2.22064 3.80803 2.60218 3.64999 3 3.64999H6C6.19891 3.64999 6.38968 3.72901 6.53033 3.86966C6.67098 4.01032 6.75 4.20108 6.75 4.39999C6.75 4.59891 6.67098 4.78967 6.53033 4.93032C6.38968 5.07098 6.19891 5.14999 6 5.14999H3V12.65H10.5V9.64999C10.5 9.45108 10.579 9.26032 10.7197 9.11966C10.8603 8.97901 11.0511 8.89999 11.25 8.89999C11.4489 8.89999 11.6397 8.97901 11.7803 9.11966C11.921 9.26032 12 9.45108 12 9.64999V12.65C12 13.0478 11.842 13.4293 11.5607 13.7107C11.2794 13.992 10.8978 14.15 10.5 14.15H3C2.60218 14.15 2.22064 13.992 1.93934 13.7107C1.65804 13.4293 1.5 13.0478 1.5 12.65V5.14999Z"
                                        fill="#373336"
                                      />
                                    </svg>
                                  </Button>
                                </Link>
                              </div>
                              <div className='px-1'>
                                <Button variant="danger" className="mr-5 text-white" onClick={() => deleteNotes(note.blogId)}>
                                  <svg
                                    width="20"
                                    height="21"
                                    viewBox="0 0 15 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M6.75 2.14999C6.61075 2.15007 6.47428 2.18891 6.35585 2.26216C6.23743 2.33541 6.14174 2.44018 6.0795 2.56474L5.5365 3.64999H3C2.80109 3.64999 2.61032 3.72901 2.46967 3.86966C2.32902 4.01032 2.25 4.20108 2.25 4.39999C2.25 4.59891 2.32902 4.78967 2.46967 4.93032C2.61032 5.07098 2.80109 5.14999 3 5.14999V12.65C3 13.0478 3.15804 13.4293 3.43934 13.7107C3.72064 13.992 4.10218 14.15 4.5 14.15H10.5C10.8978 14.15 11.2794 13.992 11.5607 13.7107C11.842 13.4293 12 13.0478 12 12.65V5.14999C12.1989 5.14999 12.3897 5.07098 12.5303 4.93032C12.671 4.78967 12.75 4.59891 12.75 4.39999C12.75 4.20108 12.671 4.01032 12.5303 3.86966C12.3897 3.72901 12.1989 3.64999 12 3.64999H9.4635L8.9205 2.56474C8.85826 2.44018 8.76257 2.33541 8.64414 2.26216C8.52572 2.18891 8.38925 2.15007 8.25 2.14999H6.75ZM5.25 6.64999C5.25 6.45108 5.32902 6.26032 5.46967 6.11966C5.61032 5.97901 5.80109 5.89999 6 5.89999C6.19891 5.89999 6.38968 5.97901 6.53033 6.11966C6.67098 6.26032 6.75 6.45108 6.75 6.64999V11.15C6.75 11.3489 6.67098 11.5397 6.53033 11.6803C6.38968 11.821 6.19891 11.9 6 11.9C5.80109 11.9 5.61032 11.821 5.46967 11.6803C5.32902 11.5397 5.25 11.3489 5.25 11.15V6.64999ZM9 5.89999C8.80109 5.89999 8.61032 5.97901 8.46967 6.11966C8.32902 6.26032 8.25 6.45108 8.25 6.64999V11.15C8.25 11.3489 8.32902 11.5397 8.46967 11.6803C8.61032 11.821 8.80109 11.9 9 11.9C9.19891 11.9 9.38968 11.821 9.53033 11.6803C9.67098 11.5397 9.75 11.3489 9.75 11.15V6.64999C9.75 6.45108 9.67098 6.26032 9.53033 6.11966C9.38968 5.97901 9.19891 5.89999 9 5.89999Z"
                                      fill="#373336"
                                    />
                                  </svg>
                                </Button>
                              </div>
                            </Col>
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
            </div>): 

            <div className='text-center p-5'>
              <Card className='mt-3 text-center m-auto p-5' style={{ width: '50rem'}}>
                <Card.Body>
                  <h3>No Vlogs Yet</h3>
                </Card.Body>
              </Card>
            </div>
          } 
        </div>
      </div>
  );
};

export default NotesList;