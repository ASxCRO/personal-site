import React from "react";
import CV from "../../assets/cv.pdf";

const CTA = () => {
	return (
		<div className="cta">
			<a
				href={CV}
				target="_blank"
				rel="noopener noreferrer"
				download
				className="btn"
			>
				Download CV
			</a>
			<a
				href="#contact"
				className="btn btn-primary"
			>
				Let's Talk
			</a>
		</div>
	);
};

export default CTA;
