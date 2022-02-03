import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import SignUp from "./Components/SignUp/SignUp";
import Home from "./Components/Home/Home";
import ProfileUpdate from "./Components/ProfileUpdate/ProfileUpdate"
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';

export default function App() {
    return(
        <Router>
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/signUp' element={<SignUp />} />
                <Route exact path='/profileUpdate/:id' element={<ProfileUpdate />} />
                <Route exact path='/forgotPassword' element={<ForgotPassword />} />
            </Routes>
           
        </Router>
    )
}