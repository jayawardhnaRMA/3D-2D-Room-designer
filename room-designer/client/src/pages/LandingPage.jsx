import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import FeaturesSection from "../components/FeaturesSection";
import ProductShowcase from "../components/ProductShowcase";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

function LandingPage() {
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

  return (
    <>
      <Navbar />
      <div className="reveal reveal--zoom" data-reveal>
        <Hero />
      </div>
      <div className="reveal reveal--pop" data-reveal>
        <Stats />
      </div>
      <div className="reveal reveal--fade" data-reveal>
        <FeaturesSection />
      </div>
      <div className="reveal reveal--morph" data-reveal>
        <ProductShowcase />
      </div>
      <div className="reveal reveal--fade" data-reveal>
        <Testimonials />
      </div>
      <div className="reveal reveal--pop" data-reveal>
        <CTASection />
      </div>
      <div className="reveal reveal--fade" data-reveal>
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;