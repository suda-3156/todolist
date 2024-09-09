import { Routes, Route } from "react-router-dom"
import { Login } from "./pages/login"
import { Signup } from "./pages/signup"
import { AnimatePresence } from "framer-motion"
import { Top } from "./pages/top"

function App() {
  return (
    <AnimatePresence>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/sign-up' element={<Signup />}/>
        <Route path="/top" element={<Top />}/>
      </Routes>
    </AnimatePresence>
  )
}

export default App
