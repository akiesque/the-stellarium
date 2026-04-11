import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import PortfolioPage from "./components/PortfolioPage";
import VrmLabPage from "./components/VrmLabPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/vrm-lab" element={<VrmLabPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
