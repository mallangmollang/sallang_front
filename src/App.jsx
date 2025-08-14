import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import OnBoardingPage from "./pages/OnBoardingPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";

function Home() {
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold ">Hello Tailwind 🚀</h1>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnBoardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}
