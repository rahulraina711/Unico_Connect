import React , { useState , useEffect } from 'react';
import "./error.scss";

export default function Error({ message }){
  

    return(
        <div className='error-message'>
            {message}
        </div>
    )
}