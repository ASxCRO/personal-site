import React from "react";
import "./about.css";
import me from "../../assets/me-about-3.jpg";

const About = () => {
	return (
		<section id="about">
			<h5>Get To Know</h5>
			<h2>About Me</h2>

			<div className="container about__container">
				<div className="about__me">
					<div className="about__me-image">
						<img
							src={me}
							alt="About"
						/>
					</div>
				</div>
				<div className="about__content">
					<div className="education__container">
						<h3>Education&nbsp;</h3>
						<div className="education__content">
							<article className="education__details">
								<h4>Virovitica University of Applied Sciences&nbsp; </h4>
								<small className="text-light">
									Bachelor's degree, Computer Software Engineering&nbsp;
								</small>
								<small className="text-light">2018 - 2021</small>
							</article>
							<article className="education__details">
								<h4>Gymnasium Požega </h4>
								<small className="text-light">Highschool&nbsp;</small>
								<small className="text-light">2014 - 2018</small>
							</article>
						</div>
					</div>

					<div className="certifications__container">
						<h3>Licenses & Certifications </h3>
						<div className="certifications__content">
							<article className="certifications__details">
								<h4>Essentials with Azure Fundamentals </h4>
								<small className="text-light">Microsoft&nbsp;</small>
								<small className="text-light">Issued Jun 2025&nbsp;</small>
								<small className="text-light">Credential ID 0T53T1V1BK6M</small>
							</article>
							<article className="certifications__details">
								<h4>Agile Fundamentals </h4>
								<small className="text-light">Pluralsight&nbsp;</small>
								<small className="text-light">Issued Sep 2022&nbsp;</small>
								<small className="text-light">
									Credential ID 82f47652-4471-404a-90e9-502390757472
								</small>
							</article>
							<article className="certifications__details">
								<h4>
									Design Microservices Architecture with Patterns & Principles
								</h4>
								<small className="text-light">Udemy&nbsp;</small>
								<small className="text-light">Issued Nov 2021&nbsp;</small>
								<small className="text-light">
									Credential ID UC-8bf542b4-9302-4254-8711-ede106b8eb12
								</small>
							</article>
							<article className="certifications__details">
								<h4>
									Microservices Architecture and Implementation on .NET 5&nbsp;
								</h4>
								<small className="text-light">Udemy&nbsp;</small>
								<small className="text-light">Issued Sep 2021&nbsp;</small>
								<small className="text-light">
									Credential ID UC-346ab864-a832-4502-876d-3e7684dc181d
								</small>
							</article>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
