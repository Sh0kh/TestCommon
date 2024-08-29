import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Foto from './Pages/Foto';
import Group from './Pages/Group';
import Students from './Pages/Students';
import StudentProfile from './Components/StudentProfile';
import Attempt from './Pages/Attempt';
import Login from './Pages/Login';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route>
              <Route path='/login' element={<Login/>}/>
              <Route path='/' element={<ProtectedRoute element={<Home />} />}>
              <Route path="/foto" element={<ProtectedRoute element={<Foto />} />} />
                <Route path='group' element={<ProtectedRoute element={<Group />} />}/>
                <Route path='students' element={<ProtectedRoute element={<Students />} />}/>
                <Route path='/studentProfile/:ID' element={<ProtectedRoute element={<StudentProfile />} />}/>
                <Route path='attempt/:id' element={<ProtectedRoute element={<Attempt />} />}/>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
