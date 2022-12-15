import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { GlobalContext } from '../context/GlobalState';
import { AuthContext } from "../context/AuthState"

import Card from 'react-bootstrap/Card';

function NotesEdit() {
  let navigate = useNavigate();
  const { notes } = useContext(GlobalContext);
  const { state } = useContext(AuthContext)
  
  const [selectedNotes, setSelectedNotes] = useState({
    blogId: '',
    title: '',
    summary: '',
    textBody: '',
  });

  useEffect(() => {
    if(state.isLoggedIn){
      getNotesData();
    }
    // eslint-disable-next-line
  }, [state.isLoggedIn]);

  async function getNotesData() {
    const params = new URLSearchParams(window.location.pathname);
    const [ key ] = params.entries()
    const id = key[0].split("/")

    const currentNoteId = id[2];
    
    let response = await fetch(
      "http://localhost:8080/blog/" + currentNoteId, {
        headers: {
          "Authorization": `Bearer ${state.token}`,
        }
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.log('error fetching data');
    }
    const updateNote = notes.find((note) => note.blogId === currentNoteId);
    if(data.data.blogId === updateNote.blogId) setSelectedNotes(data.data);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const request = new Request(
      "http://localhost:8080/blog/" + selectedNotes.blogId,
      {
        method: 'PUT',
        body: JSON.stringify(selectedNotes),
        headers: new Headers({
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${state.token}`,
          'User': state.userId,
        }),
      }
    );

    fetch(request)
      .then(navigate("/"))
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOnChange = (userKey, newValue) =>
    setSelectedNotes({ ...selectedNotes, [userKey]: newValue });

    return(
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
          <Card.Title>Edit a Vlog</Card.Title>
          <Card.Body>
            <form onSubmit={onSubmit}>
              <div className='form-group py-3'>
                <label>Title</label>
                <input type="text"
                  value={selectedNotes.title}
                  onChange={(e) => handleOnChange('title', e.target.value)}
                  placeholder="Enter title..."
                  className="form-control"
                />
              </div>
              <div className='form-group py-1'>
                <label>Summary</label>
                <input
                  type="description"
                  value={selectedNotes.summary}
                  onChange={(e) => handleOnChange('summary', e.target.value)}
                  placeholder="Enter summary..."
                  className="form-control"
                />
              </div>
              <div className='form-group py-1'>
                <label>Body</label>
                <textarea
                  type="text"
                  value={selectedNotes.textBody}
                  onChange={(e) => handleOnChange('textBody', e.target.value)}
                  placeholder="Enter body..."
                  className="form-control"
                  rows="5"
                />
              </div>
              <button className='m-3 bg-primary rounded p-2'>Save Changes</button>
            </form>
          </Card.Body>
        </Card>
        
      </div>
    )
}

export default NotesEdit;