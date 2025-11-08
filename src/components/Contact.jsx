import React from "react";
import "../styles/App.css";

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
