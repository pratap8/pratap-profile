import React from "react";
import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import ProfilePage from "./pages/ProfilePage";
import CameraPage from "./pages/CameraPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/camera" element={<CameraPage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
