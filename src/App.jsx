import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'

import { Routes, Route, Link } from "react-router-dom";

function App() {


  return (
      <div className="flex min-h-screen flex-col bg-[#f2f3f7] text-[#070606]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
  )
}

export default App
