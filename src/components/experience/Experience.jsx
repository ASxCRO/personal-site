import React from "react";
import "./experience.css";
import { AiFillCheckCircle } from "react-icons/ai";

const Experience = () => {
	return (
		<section id="experience">
			<h5>What Skills I Have</h5>
			<h2>My Experience</h2>

			<div className="container experience__container">
				<div className="experience__job">
					<h3>Job History</h3>
					<div className="experience__content">
						<article className="experience__details">
							<h4>Developer</h4>
							<small className="text-light">Axians Hrvatska · Full-time</small>
							<small className="text-light">
								Jun 2024 - Present · 1 yr 1 mo
							</small>
							<small className="text-light">Zagreb, Croatia</small>
							<small className="text-light">
								Azure DevOps Services, Microservices, Software Development,
								ASP.NET Web API, C#, Microsoft Azure, Collaborative Problem
								Solving, Microsoft SQL Server, Relational Databases,
								Elasticsearch, Vue.js, Docker, RabbitMQ, Computer Science
							</small>
						</article>
						<article className="experience__details">
							<h4>Full Stack Engineer</h4>
							<small className="text-light">Atos · Full-time</small>
							<small className="text-light">
								May 2023 - May 2024 · 1 yr 1 mo
							</small>
							<small className="text-light">Zagreb, Croatia</small>
							<small className="text-light">
								Microservices, ASP.NET, Software Development, ASP.NET Web API,
								C#, Microsoft Azure, SQL Database Administration, Collaborative
								Problem Solving, ASP.NET MVC, Collaborative Work, Transact-SQL
								(T-SQL), NHibernate, Continuous Integration and Continuous
								Delivery (CI/CD), Computer Science, JavaScript, .NET Framework
							</small>
						</article>
						<article className="experience__details">
							<h4>Software Engineer</h4>
							<small className="text-light">
								FINA - Financijska agencija · Full-time
							</small>
							<small className="text-light">
								Oct 2021 - Apr 2023 · 1 yr 7 mos
							</small>
							<small className="text-light">Zagreb, Croatia</small>
							<small className="text-light">
								.NET, Typescript, Node.js, (no)sql, Docker, Cloud
							</small>
							<small className="text-light">
								Developing, designing and maintaining government based and
								fintech projects in agile environment while using different
								kinds of frameworks and architecture designs, being lead on
								fintech based project and coordinating team up to 5 people.
							</small>
						</article>
						<article className="experience__details">
							<h4>Student Software Engineer</h4>
							<small className="text-light">
								FINA - Financijska agencija · Part-time
							</small>
							<small className="text-light">Nov 2019 - Oct 2021 · 2 yrs</small>
							<small className="text-light">Croatia</small>
							<small className="text-light">
								Developing and maintaining large scale fintech and government
								based projects.
							</small>
						</article>
						<article className="experience__details">
							<h4>Assistant Professor</h4>
							<small className="text-light">
								Polytechnic of Požega · Contract
							</small>
							<small className="text-light">Dec 2022 - Feb 2023 · 3 mos</small>
							<small className="text-light">
								Požega, Požega-Slavonia, Croatia
							</small>
							<small className="text-light">
								Teaching group of 18 students object oriented programming
								principles
							</small>
						</article>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Experience;
