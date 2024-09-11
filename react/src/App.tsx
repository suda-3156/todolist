/**
 * todolist app
 */

import { Routes, Route } from "react-router-dom"
// import { useAlertModalStore } from "./store"

import { AnimatePresence } from "framer-motion"

import { Top } from "./pages/top"
import { Login } from "./pages/login"
import { Signup } from "./pages/signup"
import { AlertModal } from "./components/modules/alertModal"
import { ProtectedRoute } from "./components/utils/protected-route"
import { Notfound } from "./pages/notfound"
import { GlobalLayout } from "./components/layout/global"

function App() {
  return (
    <AnimatePresence>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/sign-up' element={<Signup />}/>
        <Route path="/private" element={<ProtectedRoute redirectTo="/login" />}>
          <Route element={<GlobalLayout />}>
            <Route path="top" element={<Top />} />
          </Route>
        </Route>
        <Route path='*' element={<Notfound />}/>
      </Routes>
      <AlertModal key="alertmodal"/>
    </AnimatePresence>
  )
}

export default App
