import { PlatformContext } from './assets/PlatformContext'
import {BrowserRouter, Routes, Route, useActionData} from 'react-router-dom'
import './App.css'
import HomePage from './pages/homepage/HomePage'
import { useState } from 'react'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  return (
    <PlatformContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage />}/>
    </Routes>
    </BrowserRouter>
    </PlatformContext.Provider>
  )
}

export default App
