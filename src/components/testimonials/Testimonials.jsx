import React from "react";
import "./testimonials.css";
import avatar1 from "../../assets/avatar1.jpg";
import avatar2 from "../../assets/avatar2.jpg";
import avatar3 from "../../assets/avatar3.jpg";
import avatar4 from "../../assets/avatar4.jpg";

// import Swiper core and required modules
import { Pagination, Navigation } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Testimonials = () => {
	return (
		<section id="testimonials">
			<h5>Review from client</h5>
			<h2>Testimonials</h2>

			<Swiper
				className="container testimonials__container"
				modules={[Pagination, Navigation]}
				pagination={{ clickable: true }}
				spaceBetween={50}
				slidesPerView={1}
			>
				<SwiperSlide className="testimonial">
					<div className="client__avatar">
						<img
							src={avatar1}
							alt=""
						/>
					</div>
					<h5 className="client__name">Alemka Ugarković</h5>
					<small className="client__review">
						Antonio is an exceptional developer with a strong work ethic and
						great problem-solving skills. His contributions to our projects have
						been invaluable.
					</small>
				</SwiperSlide>
				<SwiperSlide className="testimonial">
					<div className="client__avatar">
						<img
							src={avatar2}
							alt=""
						/>
					</div>
					<h5 className="client__name">Hrvoje Hodak</h5>
					<small className="client__review">
						Working with Antonio has been a pleasure. His technical expertise
						and collaborative spirit make him a standout team member.
					</small>
				</SwiperSlide>
				<SwiperSlide className="testimonial">
					<div className="client__avatar">
						<img
							src={avatar3}
							alt=""
						/>
					</div>
					<h5 className="client__name">Marko Šimunović</h5>
					<small className="client__review">
						Antonio's dedication and innovative approach to development have
						significantly enhanced our project outcomes. Highly recommended!
					</small>
				</SwiperSlide>
				<SwiperSlide className="testimonial">
					<div className="client__avatar">
						<img
							src={avatar4}
							alt=""
						/>
					</div>
					<h5 className="client__name">Marka Tomljanović</h5>
					<small className="client__review">
						Antonio's technical skills and leadership qualities have made a
						lasting impact on our team. He consistently delivers high-quality
						results.
					</small>
				</SwiperSlide>
			</Swiper>
		</section>
	);
};

export default Testimonials;
