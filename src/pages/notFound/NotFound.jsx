import React from 'react'
import "./notFound.scss"
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate=useNavigate()
    const handleBack=()=>{
        navigate("/")
    }
  return (
    <div className='not-found'>
        <p>Not Found</p>
        <button onClick={handleBack} className='back-button'>Back to Home</button>
    </div>
  )
}

export default NotFound