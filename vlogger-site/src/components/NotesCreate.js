import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { GlobalContext } from '../context/GlobalState';
import { AuthContext } from "../context/AuthState"

import Card from 'react-bootstrap/Card';

function NotesCreate() {
  let navigate = useNavigate();
  const { addVlog } = useContext(GlobalContext);
  const { state } = useContext(AuthContext)

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [textBody, setBody] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const newNote = {
      title, 
      summary,
      textBody,
    };

    if(state.isLoggedIn){
      const request = new Request("http://localhost:8080/blog", {
        method: 'POST',
        body: JSON.stringify(newNote),
        headers: new Headers({
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${state.token}`,
          "User": state.userId,
        }),
      });

      fetch(request)
        .then(addVlog(newNote))
        .then(navigate("/"))
        .catch((error) => {
          console.log(error);
        });
      }
  };

    return (
      <div className='bg-light border border-white' style={{height:'92.5vh'}}>
        <Link to="/">
          <button className='m-3 bg-primary rounded p-2'>
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
          </button>
        </Link>
        <Card className="text-center m-auto py-3" style={{ width: '40rem'}}>
          <Card.Title>Create New Vlog</Card.Title>
          <Card.Body>
            <form onSubmit={onSubmit}>
              <div className='form-group py-3'>
                <label>Title</label>
                <input            
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Title"
                  className="form-control"
                />
              </div>
              <hr/>
              <div className='form-group py-1'>
                <label>Summary</label>
                <input            
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Enter Summary"
                  className="form-control"
                />
              </div>
              <div className='form-group py-1'>
                <label>Body</label>
                <textarea
                  type="text"
                  value={textBody}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter Body"
                  className="form-control"
                  rows="5"
                />
              </div>
              <button className='m-3 bg-primary rounded p-2'>Add Vlog</button>
            </form>
          </Card.Body>
        </Card>
      </div>
    )
}

export default NotesCreate;
