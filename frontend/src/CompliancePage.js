import React, { useState } from 'react';
import { Shield, FileCheck, Book, CheckSquare, AlertTriangle, BarChart, FileText, Lock } from 'lucide-react';
import axios from 'axios';

const CompliancePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  
  const [formData, setFormData] = useState({
    organizationName: '',
    industryType: 'Technology',
    complianceAreas: {
      dataProtection: false,
      corporateGovernance: false,
      industryStandards: false,
      qualityManagement: false,
      safetyCompliance: false,
      environmentalCompliance: false
    },
    challenges: ''
  });

  const [errors, setErrors] = useState({});

  // Enhanced form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Organization name validation
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    } else if (formData.organizationName.length < 2) {
      newErrors.organizationName = 'Organization name must be at least 2 characters';
    }

    // Compliance areas validation
    if (!Object.values(formData.complianceAreas).some(v => v)) {
      newErrors.complianceAreas = 'Please select at least one compliance area';
    }

    // Challenges validation
    if (!formData.challenges.trim()) {
      newErrors.challenges = 'Please describe your challenges';
    } else if (formData.challenges.length < 20) {
      newErrors.challenges = 'Please provide more detailed challenges (minimum 20 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (area) => {
    setFormData(prev => ({
      ...prev,
      complianceAreas: {
        ...prev.complianceAreas,
        [area]: !prev.complianceAreas[area]
      }
    }));
    // Clear compliance areas error when user makes a selection
    if (errors.complianceAreas) {
      setErrors(prev => ({ ...prev, complianceAreas: '' }));
    }
  };

  // Enhanced form submission with proper error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      const response = await axios({
        method: 'POST',
        url: 'http://localhost:5000/api/compliance-assessment',
        data: formData,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true // Important for CORS with credentials
      });

      if (response.data.success) {
        setSubmitStatus({
          success: true,
          message: `Assessment submitted successfully! Your reference ID is: ${response.data.applicationId}`
        });
        
        // Reset form
        setFormData({
          organizationName: '',
          industryType: 'Technology',
          complianceAreas: {
            dataProtection: false,
            corporateGovernance: false,
            industryStandards: false,
            qualityManagement: false,
            safetyCompliance: false,
            environmentalCompliance: false
          },
          challenges: ''
        });
      } else {
        throw new Error(response.data.error || 'Submission failed');
      }
    } catch (error) {
      let errorMessage = 'Failed to submit assessment. ';
      
      if (error.response) {
        // Server responded with error
        errorMessage += error.response.data.error || 'Please try again.';
      } else if (error.request) {
        // No response received
        errorMessage += 'Unable to reach server. Please check your connection.';
      } else {
        // Request setup error
        errorMessage += 'Please try again later.';
      }
      
      setSubmitStatus({
        success: false,
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Rest of your component remains the same until the assessment form...

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative">
      <div 
          className="bg-blue-900 text-white py-16 bg-cover bg-center relative"
          style={{backgroundImage: "url('/images/compliance.jpg')"}}
        >
          {/* Overlay that's limited to just the hero background */}
          <div className="absolute inset-0 bg-blue-900 opacity-60"></div>
         
        <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl font-bold mb-4">Compliance Services</h1>
        <p className="text-xl text-slate-300">Navigate complex regulatory requirements and maintain compliance with various legal frameworks</p>
        </div>
      </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'dataProtection', label: 'Data Protection' },
            { id: 'corporate', label: 'Corporate Compliance' },
            { id: 'standards', label: 'Industry Standards' },
            { id: 'assessment', label: 'Assessment' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-6 font-semibold ${
                activeTab === tab.id
                  ? 'text-blue-900 border-b-2 border-blue-900'
                  : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="mt-8">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-slate-800">Regulatory Compliance Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Shield className="w-8 h-8 text-blue-900" />,
                    title: "Data Protection",
                    desc: "Comprehensive GDPR compliance and data privacy solutions"
                  },
                  {
                    icon: <Book className="w-8 h-8 text-blue-900" />,
                    title: "Corporate Compliance",
                    desc: "Expert guidance on company law and corporate governance"
                  },
                  {
                    icon: <CheckSquare className="w-8 h-8 text-blue-900" />,
                    title: "Industry Standards",
                    desc: "ISO certifications and quality management systems"
                  }
                ].map((service, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">{service.title}</h3>
                    <p className="text-slate-600">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Protection */}
          {activeTab === 'dataProtection' && (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-slate-800">Data Protection Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <Lock className="w-6 h-6 text-blue-900 mr-2" />
                    <h3 className="text-xl font-semibold text-slate-800">GDPR Compliance</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Data protection impact assessments",
                      "Privacy policy development",
                      "Data processing agreements",
                      "Cross-border data transfer compliance",
                      "GDPR training and awareness"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckSquare className="w-5 h-5 text-green-500 mr-2 mt-1" />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-blue-900 mr-2" />
                    <h3 className="text-xl font-semibold text-slate-800">Data Privacy Audits</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Privacy program assessment",
                      "Data inventory and mapping",
                      "Security controls evaluation",
                      "Compliance gap analysis",
                      "Remediation planning"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckSquare className="w-5 h-5 text-green-500 mr-2 mt-1" />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Corporate Compliance */}
          {activeTab === 'corporate' && (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-slate-800">Corporate Compliance Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <FileCheck className="w-6 h-6 text-blue-900 mr-2" />
                    <h3 className="text-xl font-semibold text-slate-800">Company Law</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Corporate structure compliance",
                      "Statutory compliance",
                      "Board meeting procedures",
                      "Shareholder agreements",
                      "Legal documentation"
                    ].map((item, idx) => (
                      <li key={idx} className="text-slate-600">{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <BarChart className="w-6 h-6 text-blue-900 mr-2" />
                    <h3 className="text-xl font-semibold text-slate-800">Corporate Governance</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Board effectiveness",
                      "Risk management",
                      "Internal controls",
                      "Compliance frameworks",
                      "Policy development"
                    ].map((item, idx) => (
                      <li key={idx} className="text-slate-600">{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <FileText className="w-6 h-6 text-blue-900 mr-2" />
                    <h3 className="text-xl font-semibold text-slate-800">Regulatory Reporting</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Annual compliance reports",
                      "Statutory filings",
                      "Regulatory disclosures",
                      "Performance reporting",
                      "Compliance monitoring"
                    ].map((item, idx) => (
                      <li key={idx} className="text-slate-600">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Industry Standards */}
          {activeTab === 'standards' && (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-slate-800">Industry Standards & Certifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Shield className="w-8 h-8 text-blue-900" />,
                    title: "ISO Certifications",
                    items: [
                      "ISO 27001 - Information Security",
                      "ISO 9001 - Quality Management",
                      "ISO 14001 - Environmental Management",
                      "ISO 45001 - Occupational Health & Safety"
                    ]
                  },
                  {
                    icon: <CheckSquare className="w-8 h-8 text-blue-900" />,
                    title: "Quality Management",
                    items: [
                      "Quality management system development",
                      "Process optimization",
                      "Quality control procedures",
                      "Continuous improvement programs"
                    ]
                  },
                  {
                    icon: <AlertTriangle className="w-8 h-8 text-blue-900" />,
                    title: "Safety Compliance",
                    items: [
                      "Workplace safety assessments",
                      "Safety management systems",
                      "Risk assessments",
                      "Safety training programs"
                    ]
                  }
                ].map((standard, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-4">{standard.icon}</div>
                    <h3 className="text-xl font-semibold mb-4 text-slate-800">{standard.title}</h3>
                    <ul className="space-y-3">
                      {standard.items.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <CheckSquare className="w-5 h-5 text-green-500 mr-2 mt-1" />
                          <span className="text-slate-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
          <div>
            <h2 className="text-2xl font-bold mb-8 text-slate-800">Compliance Assessment</h2>
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
              {submitStatus.message && (
                <div className={`mb-6 p-4 rounded ${
                  submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {submitStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Organization Name*
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className={`w-full p-3 border ${errors.organizationName ? 'border-red-500' : 'border-slate-300'} rounded-md`}
                    />
                    {errors.organizationName && (
                      <p className="mt-1 text-sm text-red-500">{errors.organizationName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Industry Type</label>
                    <select
                      name="industryType"
                      value={formData.industryType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-md"
                    >
                      <option>Technology</option>
                      <option>Healthcare</option>
                      <option>Financial Services</option>
                      <option>Manufacturing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Areas of Compliance*
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(formData.complianceAreas).map(([area, checked]) => (
                      <div key={area} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleCheckboxChange(area)}
                          className="mr-2"
                        />
                        <label className="text-slate-600">
                          {area.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.complianceAreas && (
                    <p className="mt-1 text-sm text-red-500">{errors.complianceAreas}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Compliance Challenges*
                  </label>
                  <textarea 
                    name="challenges"
                    value={formData.challenges}
                    onChange={handleInputChange}
                    rows="4" 
                    className={`w-full p-3 border ${errors.challenges ? 'border-red-500' : 'border-slate-300'} rounded-md`}
                    placeholder="Describe your current compliance challenges and requirements"
                  ></textarea>
                  {errors.challenges && (
                    <p className="mt-1 text-sm text-red-500">{errors.challenges}</p>
                  )}
                </div>

                <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full ${
                  isSubmitting ? 'bg-blue-700' : 'bg-blue-900'
                } text-white py-3 rounded-md hover:bg-blue-800 disabled:opacity-70 transition-colors`}
              >
                {isSubmitting ? 'Submitting...' : 'Request Assessment'}
              </button>
              </form>
            </div>
          </div>
        )}

       
        </div>
      </div>
    </div>
  );
};

export default CompliancePage;