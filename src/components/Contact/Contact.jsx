import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <h2 className="section-title">Contact Me</h2>
      <p className="contact-text">
        Feel free to reach out!
      </p>

      <div className="contact-links">
        <a href="mailto:phool8790@gmail.com" className="contact-btn email">
          📧 Email
        </a>
        <a
          href="https://www.linkedin.com/in/pbrps/"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-btn linkedin"
        >
          💼 LinkedIn
        </a>
        <a
          href="tel:+918790565427"
          className="contact-btn phone"
        >
          📞 +91 87905 65427
        </a>
        <a
          href="https://www.instagram.com/pbr_pratap_singh/"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-btn instagram"
        >
          <span className="contact-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
            </svg>
          </span>
          <span>pbr_pratap_singh</span>
        </a>
        <a 
          href="https://wa.me/918790565427"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-btn whatsapp"
        >
          💬 WhatsApp Me
        </a>
      </div>
    </section>
  );
};

export default Contact;
