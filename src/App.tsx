import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import NavBar from "./components/NavBar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavBar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
