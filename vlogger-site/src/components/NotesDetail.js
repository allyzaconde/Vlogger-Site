import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { GlobalContext } from '../context/GlobalState';
import { AuthContext } from "../context/AuthState";

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import test from '../images/test.png'

function NotesDetail() {
    const { notes, getOneVlog } = useContext(GlobalContext);
    const { state } = useContext(AuthContext);
    
    const [selectedNotes, setSelectedNotes] = useState({
        blogId: '',
        title: '',
        textBody: '',
        date: '',
    });

    const [ newComment, setNewComment ] = useState({
        comment: '',
        userId: '',
    });

    const [ comments, setComments ] = useState({
        comments: []
    });

    useEffect(() => {
        if(state.isLoggedIn){
            getNotesData();
            getCommentsData();
        }
        // eslint-disable-next-line
    }, [state.isLoggedIn]);

    async function getNotesData() {
        const params = new URLSearchParams(window.location.pathname);
        const [ key ] = params.entries()
        const id = key[0].split("/")
        const currentNoteId = id[2];

        let response = await fetch(
          "http://localhost:8080/blog/" + currentNoteId,{
            headers: new Headers({
                "Authorization": `Bearer ${state.token}`,
            })
          }
        );
        const data = await response.json();
        if (!response.ok) {
          console.log('error fetching data');
        }
        getOneVlog(data.data);
        const finding = notes.find((note) => note.blogId === currentNoteId);
        if(data.data.blogId === finding.blogId) setSelectedNotes(data.data);
    }

    async function getCommentsData() {
        const params = new URLSearchParams(window.location.pathname);
        const [ key ] = params.entries()
        const id = key[0].split("/")
        const currentNoteId = id[2];

        await fetch("http://localhost:8080/blog/" + currentNoteId + "/comment", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${state.token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setComments({comments: data.data});
            setTimeout(() => {
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
          });
      }

    const handleOnChange = (userKey, newValue) =>
    setNewComment({ ...newComment, [userKey]: newValue });

    const onSubmit = (e) => {
        e.preventDefault();
        const request = new Request(
          "http://localhost:8080/blog/" + selectedNotes.blogId + "/comment",
          {
            method: 'POST',
            body: JSON.stringify(newComment),
            headers: new Headers({
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${state.token}`,
              "User": state.userId,
            }),
          }
        );
        fetch(request)
        .then(getCommentsData())
        .catch((error) => {
            console.log(error);
        });
    };

    async function deleteComment(commentId) {
        const params = new URLSearchParams(window.location.pathname);
        const [ key ] = params.entries()
        const id = key[0].split("/")
        const currentNoteId = id[2];

        await fetch("http://localhost:8080/blog/" + currentNoteId + "/" + commentId, {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${state.token}`,
                "User": state.userId,
            },
        })
        .then((response) => {
            if(response.ok){
                return response.text()
            }
            return response.text()
            .then((text) => {
                const msg = JSON.parse(text)
                const error = msg.message
                window.alert(error);
            })
        })
        .then(getCommentsData())
        .catch((error) => {
            console.log(error);
        })
    }

    function getDate(date){
        const convert = new Date(date)
        return convert.toLocaleString()
    }

    return (
        <div className='bg-light border border-white pb-5' style={{height:'100%'}}>
            <Link to="/">
                <Button className='m-3 bg-primary rounded p-2'>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#000000" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <path d="M19 12H6M12 5l-7 7 7 7"/>
                </svg>
                    Go Back
                </Button>
            </Link>
            <Card className="text-center m-auto" style={{ width: '50rem'}}>
                <Card.Body>
                    <Card.Title>
                        <h4><b>{selectedNotes.title}</b></h4>
                    </Card.Title>
                    <Card.Subtitle className='text-primary pb-3'>
                        {selectedNotes.username}
                    </Card.Subtitle>
                    <Card.Subtitle className='text-muted'>
                        {getDate(selectedNotes.dateCreated)}
                    </Card.Subtitle>

                    <Card.Text className="my-3 gy-5">
                        <small><em>{selectedNotes.summary}</em></small>
                        <br/>
                        {selectedNotes.textBody}
                    </Card.Text>
                </Card.Body>
                {selectedNotes.dateCreated === selectedNotes.dateUpdated ? (<hr/>) : 
                    <Card.Footer className='text-muted'>
                        edited {getDate(selectedNotes.dateUpdated)}
                    </Card.Footer>}
                <Card.Body>
                    <form onSubmit={onSubmit}>
                        <Row>
                            <Col className="col-2">
                                <Row>
                                    <img src={test} className="rounded-circle img-fluid" alt='test'/>
                                </Row>
                                <Row className="row justify-content-center text-primary">
                                    {state.username}
                                </Row>
                            </Col>
                            <Col>
                                <div className='form-group'>
                                    <textarea
                                        type="text"
                                        onChange={(e) => handleOnChange('comment', e.target.value)}
                                        placeholder="Enter comment..."
                                        className="form-control p-4 mb-3"
                                    />
                                </div>
                            </Col>
                        </Row>
                        <button className='bg-primary rounded p-2 mb-3 float-end' type="submit">
                            Add Comment
                        </button>
                    </form>
                </Card.Body>
                <Card.Footer>
                    {(comments.comments || []).map((comment) => (
                        <Card key={comment.commentId} className="my-3 p-3 text-start">
                            <Row className='gx-5'>
                                <Col className='col-2'>
                                    <img src={test} className="rounded-circle img-fluid" alt='test'/>
                                </Col>
                                <Col>
                                    <Row> 
                                        <Col className='text-primary'>
                                            {comment.username}
                                        </Col>
                                        <Col className='col-auto' style={{ cursor: 'pointer' }}>
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                width="24" 
                                                height="24" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                stroke="#000000" 
                                                strokeWidth="2" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round"
                                                onClick={() => deleteComment(comment.commentId)}
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18">
                                                </line>
                                                <line x1="6" y1="6" x2="18" y2="18">
                                                </line>
                                            </svg>
                                        </Col>
                                        
                                    </Row>
                                    <Row className='text-muted'>
                                        <small>{getDate(comment.dateCreated)}</small>
                                    </Row>
                                    <Row className='mt-2'>
                                        {comment.comment}
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Card.Footer>
            </Card>
        </div>
    )
}

export default NotesDetail;