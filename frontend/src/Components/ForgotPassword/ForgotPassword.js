import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from "react-router-dom"
import './forgot_pass.scss';
import Error from "../Error/Error";

export default function ForgotPassword () {

    const navigate = useNavigate();

    const [ emailQuery , setEmailQuery ] = useSearchParams();
    let [ email , setEmail ] = useState(emailQuery.get("q"));
    let [ gotDetails , setGotDetails ] = useState(false);
    let [ error , setError ] = useState("");
    let [status , setStatus] = useState("Check User");
    let [ pass , setPass ] = useState("");

    const getUser = async() => {
        setStatus("Checking....");
        let { data } = await axios.get("http://localhost:4000/user?email="+email) ;
        console.log(data);
        if(data.email) {
            setEmail(data.email);
            setGotDetails(true)
            setStatus("Reset Password")
        }
        else{
            setError("Email not found. Please Sign Up.")
            setStatus("Check User")
        }
    }

    const resetPass = async() => {
        if(pass){
            let { data } = await axios.patch("http://localhost:4000/reset/password",{ email , password : pass });
            if(data.success){
                navigate("/signUp")
            }
            else{
                setError(data.message)
            }
        }
        else{
            setError("Password cannot be empty.")
        }
    }

    return(
        <div className='forgot-main'>
            <div className='selector-container'>
                <p>Reset Password</p>
            </div>
            { error && <Error message={error} /> }
            {gotDetails && <p>Enter new password for {email} :</p>}
            {!gotDetails&&<input placeholder='Enter the email' value={email!=="undefined"?email:""} onChange={e=>setEmail(e.target.value)} />}
            {gotDetails && <input placeholder='Enter New password' value={pass} onChange={e=>setPass(e.target.value)} />}
            <div className='action-area'>
                <p className='action-button' onClick={async()=> !gotDetails ? await getUser() : await resetPass()} >{status}</p>
                <p className='cancel' onClick={()=> navigate("/signUp")} >Cancel</p>
            </div>
        </div>
    )
}