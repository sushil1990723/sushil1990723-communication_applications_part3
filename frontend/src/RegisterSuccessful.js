import React from 'react'
import { Link } from 'react-router-dom'

export default function RegisterSuccessful() {
  return (
    <div>
      <h1 className="mb-5">Register Sucessfully</h1>
      <p className="mb-3">Thank you for your registration</p>
      <Link to="/">Click return to home page</Link>
    </div>
  )
}
