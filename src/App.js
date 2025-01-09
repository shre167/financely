import "./App.css";
import Header from "./components/Header/Index";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Signup from "./Pages/Signup"; 
import { ToastContainer, test } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
    <ToastContainer/>
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
     </>
  );
}

export default App;
