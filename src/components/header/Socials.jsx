import React from "react";
import { BsLinkedin, BsGithub } from "react-icons/bs";

const Socials = () => {
	return (
		<div className="header__socials">
			<a
				href="https://linkedin.com/in/antonio-supan"
				target="_blank"
				rel="noreferrer"
			>
				<BsLinkedin />
			</a>
			<a
				href="https://github.com/asxcro"
				target="_blank"
				rel="noreferrer"
			>
				<BsGithub />
			</a>
		</div>
	);
};

export default Socials;
