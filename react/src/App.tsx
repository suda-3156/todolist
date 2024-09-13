/**
 * todolist app
 */

import { Routes, Route } from "react-router-dom"
// import { useAlertModalStore } from "./store"

import { AnimatePresence } from "framer-motion"

import { Top } from "./pages/top"
import { LoginForm } from "./pages/login"
import { Signup } from "./pages/signup"
import { AlertModal } from "./components/modules/alertModal"
import { ProtectedRoute } from "./components/wapper/protected-route"
import { Notfound } from "./pages/notfound"
import { GlobalLayout } from "./components/template/global"

function App() {
  return (
    <AnimatePresence>
      <Routes>
        <Route path='/login' element={<LoginForm />}/>
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
