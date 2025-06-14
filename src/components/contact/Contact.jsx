import "./contact.css";
import { MdOutlineEmail } from "react-icons/md";
import { BsWhatsapp } from "react-icons/bs";
import React, { useRef } from "react";
import emailjs from "emailjs-com";

const Contact = () => {
	const form = useRef();

	const sendEmail = (e) => {
		e.preventDefault();

		emailjs
			.sendForm(
				"service_vr0ombd",
				"template_5vhutki",
				form.current,
				"kQOda6GvkcqF5gfll"
			)
			.then(
				(result) => {
					console.log(result.text);
				},
				(error) => {
					console.log(error.text);
				}
			);

		e.target.reset();
	};

	return (
		<section id="contact">
			<h5>Get In Touch</h5>
			<h2>Contact Me</h2>

			<div className="container contact__container">
				<div className="contact__options">
					<article className="contact__option">
						<MdOutlineEmail className="contact__option-icon" />
						<h4>Email</h4>
						<h5>antonio.supan@icloud.com</h5>
						<a
							href="mailto:antonio.supan@icloud.com"
							target="_blank"
							rel="noreferrer"
						>
							Send a message
						</a>
					</article>

					<article className="contact__option">
						<BsWhatsapp className="contact__option-icon" />
						<h4>WhatsApp</h4>
						<h5>+385994114013</h5>
						<a
							href="https://web.whatsapp.com/send?phone=3850994114013"
							rel="noreferrer"
							target="_blank"
						>
							Send a message
						</a>
					</article>
				</div>
				<form
					ref={form}
					onSubmit={sendEmail}
				>
					<input
						type="text"
						name="name"
						placeholder="Your Full Name"
						required
					/>
					<input
						type="email"
						name="email"
						placeholder="Your Email"
						required
					/>
					<textarea
						name="message"
						placeholder="Your Message"
						rows="7"
						required
					></textarea>
					<button
						type="submit"
						className="btn btn-primary"
					>
						Send Message
					</button>
				</form>
			</div>
		</section>
	);
};

export default Contact;
