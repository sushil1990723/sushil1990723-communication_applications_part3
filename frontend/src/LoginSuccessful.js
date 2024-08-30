import React, { useState } from 'react';

export default function LoginSuccessful() {

  const logdinuser = localStorage.getItem('loggedInUser');
  
  return (
    <div className='mt-5 mb-5'>LoginSuccessful <b> {logdinuser} </b></div>
  )
}
