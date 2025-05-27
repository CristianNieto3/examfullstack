import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Signup  from '@/pages/Signup'
import Login   from '@/pages/Login'
import Home    from '@/pages/Home'
import AddExam from '@/pages/AddExam'
import Exams   from '@/pages/Exams'
import EditExam  from '@/pages/EditExam'
import ViewExam  from '@/pages/ViewExam'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup  />} />
        <Route path="/login"  element={<Login   />} />
        <Route path="/home"   element={<Home    />} />
        <Route path="/add"    element={<AddExam />} />
        <Route path="/exams"  element={<Exams   />} />
        <Route path="/exams/:id" element={<EditExam />} />
        <Route path="/exams/view/:id" element={<ViewExam />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
