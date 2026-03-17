import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactHero from "../components/ContactHero";
import ContactContainer from "../components/ContactContainer";
import FAQPreview from "../components/FAQPreview";

function ContactPage() {
  return (
    <>
      <Navbar />

      <ContactHero />
      <ContactContainer />
      <FAQPreview />
      <Footer />
    </>
  );
}

export default ContactPage;