import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import VotingPortal from './pages/voting_portal'
import Chatroom from './pages/Chatroom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/voting-portal' element={<VotingPortal/>} />
          <Route path='/chatroom' element={<Chatroom/>} />
          <Route path="*" element={<div className='w-screen h-screen flex justify-center items-center'>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>    
    </>

  )
}

export default App
