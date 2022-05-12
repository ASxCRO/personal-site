import React from "react";
import "./nav.css";
import { BiHomeAlt, BiUser } from "react-icons/bi";
import { BsBookmarkStar } from "react-icons/bs";
import { MdWorkOutline, MdPermContactCalendar } from "react-icons/md";
import { useState } from "react";

const Nav = () => {
  const [activeNav, setActiveNav] = useState("#");

  return (
    <nav>
      <a
        // eslint-disable-next-line
        href="#"
        onClick={() => setActiveNav("#")}
        className={activeNav === "#" ? "active" : ""}
      >
        <BiHomeAlt />
      </a>
      <a
        // eslint-disable-next-line
        href="#about"
        onClick={() => setActiveNav("#about")}
        className={activeNav === "#about" ? "active" : ""}
      >
        <BiUser />
      </a>
      <a
        // eslint-disable-next-line
        href="#experience"
        onClick={() => setActiveNav("#experience")}
        className={activeNav === "#experience" ? "active" : ""}
      >
        <BsBookmarkStar />
      </a>
      <a
        // eslint-disable-next-line
        href="#services"
        onClick={() => setActiveNav("#services")}
        className={activeNav === "#services" ? "active" : ""}
      >
        <MdWorkOutline />
      </a>
      <a
        // eslint-disable-next-line
        href="#contact"
        onClick={() => setActiveNav("#contact")}
        className={activeNav === "#contact" ? "active" : ""}
      >
        <MdPermContactCalendar />
      </a>
    </nav>
  );
};

export default Nav;
