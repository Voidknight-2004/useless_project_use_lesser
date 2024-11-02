import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Goals from "./pages/Goals";
import Timer from "./pages/Timer";
import Navbar from "./components/navbar";
import Chatbot from "./pages/Chatbot";

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Goals />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
