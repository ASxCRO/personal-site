import React from "react";
import "./footer.css";
import {
  AiOutlineFacebook,
  AiOutlineLinkedin,
  AiOutlineGithub,
} from "react-icons/ai";

const Footer = () => {
  return (
    <footer>
      <a href="#" className="footer__logo">
        SUPAN
      </a>
      <ul className="permalinks">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#experience">Experience</a>
        </li>
        <li>
          <a href="#testimonials">Testimonials</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>

      <div className="footer__socials">
        <a href="https://facebook.com">
          <AiOutlineFacebook />
        </a>
        <a href="https://linkedin.com">
          <AiOutlineLinkedin />
        </a>
        <a href="https://github.com">
          <AiOutlineGithub />
        </a>
      </div>

      <div className="footer__copyright">
        <small>&copy; SUPAN. All rights reserved</small>
      </div>
    </footer>
  );
};

export default Footer;
