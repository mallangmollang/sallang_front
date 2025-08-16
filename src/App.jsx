import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import OnBoardingPage from "./pages/OnBoardingPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import ShelterPage from "./pages/ShelterPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnBoardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/shelter" element={<ShelterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
