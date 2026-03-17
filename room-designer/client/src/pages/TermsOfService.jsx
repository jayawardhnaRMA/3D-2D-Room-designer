import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfService = () => {
  return (
    <>
      <Navbar />
      <div className="font-sans text-gray-900 bg-gray-50 min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-6 bg-white p-10 rounded-xl shadow-sm">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Terms of Service</h1>
          <p className="mb-4 text-gray-600">Last updated: March 2026</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed mb-4">By accessing and using Roomio, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
          <p className="text-gray-700 leading-relaxed mb-4">You are responsible for safeguarding your account login information. Any activity on your account is your responsibility.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Prohibited Conduct</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Users must not use Roomio for any illegal or unauthorized purpose. Do not upload malicious code, or infringe on others' intellectual property.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed mb-4">All generated designs remain your property, but by using Roomio, you grant us a license to use and display these designs internally for platform improvement purposes as outlined in our Privacy Policy.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;
