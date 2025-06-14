import React from "react";
import "./header.css";
import CTA from "./CTA";
import ME from "../../assets/me.png";
import Socials from "./Socials";

const Header = () => {
	return (
		<header>
			<div className="container header__container">
				<div className="h5">Hello I'm</div>
				<h1>Antonio Supan</h1>
				<h5 className="text-light">Fullstack Engineer</h5>
				<CTA />
				<Socials />

				<div className="me">
					<img
						src={ME}
						alt=""
					/>
				</div>

				<a
					href="#contact"
					className="scroll__down"
				>
					Scroll Down
				</a>
			</div>
		</header>
	);
};

export default Header;
