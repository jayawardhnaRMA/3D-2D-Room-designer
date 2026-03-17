import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutHero from "../components/AboutHero";
import OurStorySection from "../components/OurStorySection";
import OurCoreValues from "../components/OurCoreValues";
import MeetLeadership from "../components/MeetLeadership";

function AboutUs(){

useEffect(() => {
	const elements = Array.from(document.querySelectorAll("[data-reveal]"));
	if (elements.length === 0) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
	);

	elements.forEach((el) => observer.observe(el));
	return () => observer.disconnect();
}, []);

return(

<>
<Navbar/>
<div className="reveal reveal--zoom" data-reveal>
	<AboutHero/>
</div>
<div className="reveal reveal--fade" data-reveal>
	<OurStorySection/>
</div>
<div className="reveal reveal--pop" data-reveal>
	<OurCoreValues/>
</div>
<div className="reveal reveal--morph" data-reveal>
	<MeetLeadership />
</div>
<div className="reveal reveal--fade" data-reveal>
	<Footer/>
</div>
</>

);

}

export default AboutUs;