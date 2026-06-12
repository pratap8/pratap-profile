import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Contact from "../components/Contact";
import Certificate from "../components/Certifications";
import Resume from "../components/Resume";
import Publications from "../components/Publications";
import HonorsAwards from "../components/HonorsAwards";
import Education from "../components/Education";
import Chatbot from "../components/Chatbot";
import Footer from "../components/Footer";
import BugReport from "../components/BugReport";

const ProfilePage = () => {
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
      <Footer />
      <BugReport />
      <Chatbot />
    </div>
  );
};

export default ProfilePage;
