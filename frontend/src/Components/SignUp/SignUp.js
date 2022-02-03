import React , { useState } from 'react';
import axios from 'axios';
import "./sign_up.scss";
import {API} from "../../Utils/APIS";
import Error from "../Error/Error";
import {useNavigate} from "react-router-dom"

export default function SignUp () {

    const navigate = useNavigate();

    let [full_name , setFullName ] = useState() ;
    let [ email ,setEmail ] = useState();
    let [ password , setPassword ] = useState();
    let [ sign_up , setSignUp ] = useState(true);
    let [ input_type , setInputType ] = useState("password");
    let [ error , setError ] = useState(false);
    
    const submitAction= async(sign_up) => {
        setError(false);
       
        try {
            let url = API + `/user/${sign_up ? "signUp" : "login"}` ;
            let request_body = {
                email,
                password,
            };

            if(sign_up) request_body["full_name"] = full_name ;

            let api_resp = await axios.post(url , request_body);

            console.log(api_resp.data);

            if(!api_resp.data.success) setError(api_resp.data.message);
            if(api_resp.data.success){
                localStorage.setItem("accessToken", JSON.stringify({accessToken : api_resp.data.token , userId :api_resp.data.userId }))
                navigate("/");
            }
            


        } catch (error) {
            console.log("caught in error",error)
        }
    }

    return(
        <div className='sign-up-main'>      
            <div className='selector-container'>
                <p className={`hoverable ${sign_up ? "selected" : ""}`} onClick={()=>setSignUp(true)}>Sign Up</p>
                <p>|</p>
                <p className={`hoverable ${!sign_up ? "selected" : ""}`} onClick={()=>setSignUp(false)}>Log In</p>
            </div>
            { error && <Error message={error} />}
            {sign_up && 
                <div className='full-name'>
                    <input  placeholder='Enter full name' value={full_name} onChange={(e)=>setFullName(e.target.value)}/>
                </div>
            }
            <input placeholder='Enter your email' value={email} onChange={(e)=>{setEmail(e.target.value)}} />
            <input placeholder={`${sign_up ? "Enter password" : "Enter your password"}`} value={password}  onChange={e=>setPassword(e.target.value)} />
            <div className='submit'>
                <p id="action-button" className='hoverable' onClick={async()=>await submitAction(sign_up ? true : false)}>{sign_up ? "Sign Up" : "Log In"}</p>
                { !sign_up && <p id="f-pass" className='hoverable' onClick={()=>navigate(`/forgotPassword?q=${email}`)}>Forgot Password ?</p>}
            </div>

        </div>
    )
}