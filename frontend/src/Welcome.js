import React from 'react'
import { Link } from 'react-router-dom'

export default function Welcome() {
  return (
    <div>
      <div className="container pt-5 text-center">
        <h1 className="mb-5">Welcome to Users module</h1>
        <h3 className="mb-3">Existing User</h3>
        <Link to="./login" className="btn btn-primary mb-5">Login</Link>
        <h3 className="mb-3 ">New Users</h3>
        <Link className="btn btn-primary" to="./register">Register</Link>
      </div>
    </div>
  )
}
