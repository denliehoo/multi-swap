import './App.css';
import { Routes, Route } from "react-router-dom"
import HomePage from './pages/HomePage';
import AppPage from './pages/AppPage';
import NavBar from './components/layout/NavBar';

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        {/* <Route exact path="/" element={<HomePage />} /> */}
        <Route exact path="/" element={<AppPage />} />
      </Routes>
    </div>
  );
}

export default App;
