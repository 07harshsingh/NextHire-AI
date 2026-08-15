import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CreateInterviews from './pages/CreateInterviews';
import Interview from './pages/Interview';
import EditInterview from './pages/EditInterview';
import Profile from './pages/Profile';
import AppLayout from './components/layout/AppLayout';
import Result from './pages/Result';
import ResultHistory from './pages/ResultHistory';

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/dashboard' element={<AppLayout><ProtectedRoute><Dashboard/></ProtectedRoute></AppLayout>}></Route>
      <Route path='/myprofile' element={<AppLayout><ProtectedRoute><Profile/></ProtectedRoute></AppLayout>}></Route>
      <Route path='/edit-interview/:id' element={<AppLayout><ProtectedRoute><EditInterview/></ProtectedRoute></AppLayout>}></Route>
      <Route path='/create-interview' element={<AppLayout><ProtectedRoute><CreateInterviews/></ProtectedRoute></AppLayout>}></Route>
      <Route path='/interview/:id' element={<ProtectedRoute><Interview/></ProtectedRoute>}></Route>
      <Route path='/results' element={<AppLayout><ProtectedRoute><ResultHistory/></ProtectedRoute></AppLayout>}></Route>
      <Route path='/result/:id' element={<AppLayout><ProtectedRoute><Result/></ProtectedRoute></AppLayout>}></Route>
    </Routes>
    </>
  )
}

export default App;
