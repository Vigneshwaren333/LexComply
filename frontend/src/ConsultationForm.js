import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MessageSquare, FileText, Clock, Shield } from 'lucide-react';

const ConsultationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    caseType: '',
    urgency: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch('http://localhost:5000/api/consultation/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // Add this for cookies if needed
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          loading: false,
          error: null,
          success: true
        });
        alert(`Consultation request submitted successfully! Your consultation ID is: ${data.consultationId}`);
        setTimeout(() => navigate('/'), 2000);
      } else {
        throw new Error(data.error || 'Failed to submit consultation request');
      }
    } catch (error) {
      console.error("Error Submitting Form:", error);
      setSubmitStatus({
        loading: false,
        error: error.message,
        success: false
      });
      alert('Error submitting consultation request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-t-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Schedule Your Free Consultation</h2>
            <p className="text-slate-300">
              Take the first step towards resolving your legal matters. Our expert team will review your case and provide personalized guidance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-center space-x-3">
                <Clock className="text-yellow-500 w-8 h-8" />
                <div>
                  <h3 className="font-semibold">24/7 Response</h3>
                  <p className="text-sm text-slate-300">Quick response guaranteed</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="text-yellow-500 w-8 h-8" />
                <div>
                  <h3 className="font-semibold">Free Assessment</h3>
                  <p className="text-sm text-slate-300">No hidden charges</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="text-yellow-500 w-8 h-8" />
                <div>
                  <h3 className="font-semibold">Confidential</h3>
                  <p className="text-sm text-slate-300">100% secure & private</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-b-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-900" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-blue-900" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-blue-900" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Case Type
                  </label>
                  <select
                    name="caseType"
                    value={formData.caseType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a case type</option>
                    <option value="rti">RTI Filing</option>
                    <option value="cyber">Cyber Law</option>
                    <option value="compliance">Regulatory Compliance</option>
                    <option value="corporate">Corporate Law</option>
                    <option value="other">Other Legal Matters</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Urgency Level
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select urgency level</option>
                  <option value="immediate">Immediate - Within 24 hours</option>
                  <option value="urgent">Urgent - Within 3 days</option>
                  <option value="normal">Normal - Within a week</option>
                  <option value="flexible">Flexible Timeline</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-blue-900" />
                  Case Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide brief details about your case..."
                  required
                ></textarea>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">
                  By submitting this form, you agree to our privacy policy and terms of service. 
                  All information shared will be kept strictly confidential.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitStatus.loading}
                className={`w-full bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 
                  text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform 
                  hover:scale-[1.02] ${submitStatus.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {submitStatus.loading ? 'Submitting...' : 'Request Free Consultation'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;