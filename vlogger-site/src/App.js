import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext } from "./context/AuthState";
import React, { useContext, useEffect } from 'react';

import NotesList from './components/NotesList';
import NotesDetail from './components/NotesDetail';
import NotesEdit from './components/NotesEdit';
import NotesCreate from './components/NotesCreate';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';


function App() {
  const { state, login } = useContext(AuthContext)

  useEffect(() => {
    checkLog();
    checkOpts();
    // eslint-disable-next-line
  }, [state.isLoggedOut]); 

  function checkLog(){
    if(state.isLoggedOut){
      window.localStorage.setItem('userId', "");
      window.localStorage.setItem('token', "");
      window.localStorage.setItem('username', "");
    }
  }

  function checkOpts(){
    let username
    let userId
    let token
    if(window.localStorage.getItem('username').length === 0){
      username = ""
      userId = ""
      token = ""
    }else{
      username = JSON.parse(window.localStorage.getItem('username'));
      userId = JSON.parse(window.localStorage.getItem('userId'));
      token = JSON.parse(window.localStorage.getItem('token'))
    }
    login(userId, token, username);
  }

  if(!state.isLoggedIn){
    return(
      <Routes>
          <Route path="/login" element={<Login/>} exact/>
          <Route path="/register" element={<Register/>} exact/>
          <Route path="*" element={<Navigate to="/login"/>} exact/>
      </Routes>
    )
  }else{
    window.localStorage.setItem('userId', JSON.stringify(state.userId));
    window.localStorage.setItem('token', JSON.stringify(state.token));
    window.localStorage.setItem('username', JSON.stringify(state.username));
    return(
      <Routes>
          <Route path="/" element={<NotesList/>} exact/>
          <Route path="/detail/:blogId/" element={<NotesDetail/>} exact/>
          <Route path="/edit/:blogId" element={<NotesEdit/>} exact/>
          <Route path="/create" element={<NotesCreate/>} exact/>
          <Route path="/user" element={<UserProfile/>} exact/>
          <Route path="*" element={<Navigate to="/"/>} exact/>
      </Routes>
    )
  }
}

export default App;