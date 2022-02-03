/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect , useState } from 'react';
import "./home.scss";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { API } from "../../Utils/APIS";
import placeholder from "../../Assets/images/placeholder.png"

export default function Home() {

    let navigate = useNavigate();
     let [ loading , setLoading ] = useState(true);
     let [ email , setEmail ] = useState("N/A");
     let [ name , setName ] = useState("N/A");
     let [ profile , setProfile ] = useState(placeholder);
     let [ uId ,setUid ] = useState(false);


    const checkToken = async () => {
        let token = localStorage.getItem("accessToken");
        if(!token) navigate("/signUp");
        if(token) {
            let details = JSON.parse(token);
            console.log("details ", details);
            try{
                let session = await axios.get(API+"/checkSession/", { headers : { "Authorization" : `Bearer ${details.accessToken}` }});
                return {session , userId : details.userId}
            }catch(err){
                navigate("/signUp")
            }

        }
    };

    const getUser = async (userId) => {
        let user = await axios.get(API+`/user/${userId}`)
        console.log(user.data);
        setUid(user.data._id);
        setName(user.data.full_name);
        setEmail(user.data.email);
        user.data.image_url ? setProfile(user.data.image_url) : setProfile(placeholder);
    };

    const logOut = () => {
        localStorage.clear() ;
        navigate("/signUp")
    }

    useEffect(()=>{
        checkToken().then(async resp=> {console.log(resp)
            if(resp.session.data.success) { 
                setLoading(false)
                await getUser(resp.userId)
            }
            else{
                navigate("/signUp")
            }
        }).catch(e=>{navigate("/signUp");console.log(e)});
    },[]);

    

    return(
        <div className='home-main'>
            <div className='user-details'>
                <img className='profile' src={profile} alt='profile' />
                <p className='details'>{name}</p>
                <p className='details'>{email}</p>
                <p className='action-button' onClick={()=>navigate(`/profileUpdate/${uId}`)}>Update Profile</p>
                <p className='logout' onClick={()=>logOut()}>Log Out</p>
            </div>
            
        </div>
    )
}