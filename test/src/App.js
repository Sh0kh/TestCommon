import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
// import Test from './Components/Test';
import Result from './Components/Result';
import ResultItem from './Components/ResultItem';
import Test1 from './Components/Test1';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}>
            <Route index element={<Test1/>} />
            <Route path='/result' element={<Result />} />
            <Route path='/resultItem/:ID' element={<ResultItem/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
