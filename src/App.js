import React from "react";
import "./styles/App.css";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Certificate from "./components/Certifications";
import Resume from "./components/Resume";
import Publications from "./components/Publications";
import HonorsAwards from "./components/HonorsAwards";
import Education from "./components/Education";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Experience />
      <Education />
      <Resume />
      <Certificate />
      <Publications />
      <HonorsAwards />
      <Projects />
      <Skills />
      <Contact />

      
      {/* 👇 Add chatbot here so it floats on top of everything */}
      <Chatbot />
      
      {/* ✅ Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;
