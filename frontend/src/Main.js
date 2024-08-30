
import React from 'react';
import Nav from './Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './Welcome';
import Login from './Login';
import Register from './Register';
import LoginSuccessful from './LoginSuccessful';
import RegisterSuccessful from './RegisterSuccessful';
import ChatList from './ChatList';
import UserList from './UserList';
import EditUser from './EditUser';
import DocumentList from './DocumentList';
import Logout from './Logout';

export default function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/' element={<Nav />}>
          <Route path='/loginsuccessful' element={<LoginSuccessful />} />
          <Route path='/chatlist' element={<ChatList />} />
          <Route path='/userlist' element={<UserList />} />
          <Route path='/edituser' element={<EditUser />} />
          <Route path='/documentlist' element={<DocumentList />} />
          <Route path='/logout' element={<Logout />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/registersuccessful' element={<RegisterSuccessful />} />
      </Routes>
    </BrowserRouter>
  )
}
