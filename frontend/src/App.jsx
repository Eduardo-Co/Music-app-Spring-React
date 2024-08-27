import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Login from './components/Login/Login';
import Home from './components/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
