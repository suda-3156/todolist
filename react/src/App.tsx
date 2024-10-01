/**
 * todolist app
 */

import { Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import { AlertModal } from "./components/features/alert-modal/alertModal"

import { LoginForm } from "./pages/login"
import { Signup } from "./pages/signup"

import { ProtectedRoute } from "./components/shared/wapper/protected-route"
import { GlobalLayout } from "./components/shared/template/global"
import { Top } from "./pages/top"
import { Todolist } from "./pages/todolist"

import { Notfound } from "./pages/notfound"
import { Test } from "./pages/testpage"

function App() {
  return (
    <AnimatePresence>
      <Routes>
        <Route path='/login' element={<LoginForm />}/>
        <Route path='/sign-up' element={<Signup />}/>
        <Route path="/private" element={<ProtectedRoute redirectTo="/login" />}>
          <Route element={<GlobalLayout />}>
            <Route path="top" element={<Top />} />
            <Route path="todolist" element={<Todolist />} />
            <Route path="testpage" element={<Test />} />
          </Route>
        </Route>
        <Route path='*' element={<Notfound />}/>
      </Routes>
      <AlertModal key="alertmodal"/>
    </AnimatePresence>
  )
}

export default App
