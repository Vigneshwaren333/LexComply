import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HomePage from "./Home";
import RTIPage from "./Rtipage";
import CyberLawPage from "./Cyberlaw";
import CompliancePage from "./CompliancePage";
import ConsultationForm from "./ConsultationForm";
import ServicesPage from "./ServicesPage";
import AuthPage from "./AuthPage";
import GeminiChatbot from "./GeminiChatbot"; // Adjust path if needed

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/consultation" element={<ConsultationForm />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/rti" element={<RTIPage />} />
          <Route path="/services/cyber-law" element={<CyberLawPage />} />
          <Route path="/services/compliance" element={<CompliancePage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
        <Footer />

        {/* Floating chat button */}
        <div className="fixed bottom-6 right-6 z-50">
          {isChatOpen ? (
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="relative">
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="absolute top-3 right-3 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors"
                  aria-label="Close chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <GeminiChatbot />
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors flex items-center justify-center"
              aria-label="Open chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;