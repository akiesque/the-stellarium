import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import PortfolioPage from "./components/PortfolioPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
