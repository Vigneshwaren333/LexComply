import React, { useState } from 'react';
import { FileText, ClipboardCheck, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const CyberlawPortal = () => {
  // State management
  const [activeTab, setActiveTab] = useState('process');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    applicationType: 'RTI Application',
    subject: '',
    description: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setSubmitStatus({
        type: 'error',
        message: 'Maximum 5 files allowed'
      });
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        setSubmitStatus({
          type: 'error',
          message: `Invalid file type: ${file.name}`
        });
      }
      if (!isValidSize) {
        setSubmitStatus({
          type: 'error',
          message: `File too large: ${file.name}`
        });
      }
      
      return isValidType && isValidSize;
    });

    setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  // Remove file from selection
  const removeFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid email address'
      });
      setIsSubmitting(false);
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid 10-digit phone number'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append files
      selectedFiles.forEach(file => {
        formDataToSend.append('documents', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/cyberlaw/submit`, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: `Application submitted successfully! Your application ID is: ${data.applicationId}`
        });
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          applicationType: 'RTI Application',
          subject: '',
          description: ''
        });
        setSelectedFiles([]);
      } else {
        throw new Error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Error submitting application. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section with Background Image */}
      <div className="relative">
        <div 
          className="bg-blue-900 text-white py-16 bg-cover bg-center relative"
          style={{backgroundImage: "url('/images/cyberlaw.jpg')"}}
        >
          {/* Overlay that's limited to just the hero background */}
          <div className="absolute inset-0 bg-blue-900 opacity-60"></div>
          
          {/* Content that sits above the overlay */}
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl font-bold mb-4">Cyberlaw Portal</h1>
            <p className="text-xl text-slate-300">Manage your RTI applications, security compliances, and legal documentation</p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          {[
            { id: 'process', label: 'Application Process' },
            { id: 'applications', label: 'My Applications' },
            { id: 'instructions', label: 'Filing Instructions' },
            { id: 'tracking', label: 'Track Status' },
            { id: 'form', label: 'New Application' }
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
          {/* Application Process */}
          {activeTab === 'process' && (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-slate-800">Application Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <FileText className="w-8 h-8 text-blue-900" />,
                    title: "1. File Application",
                    desc: "Fill out the application form with required details"
                  },
                  {
                    icon: <ClipboardCheck className="w-8 h-8 text-blue-900" />,
                    title: "2. Review & Submit",
                    desc: "Our experts review and submit your application"
                  },
                  {
                    icon: <Clock className="w-8 h-8 text-blue-900" />,
                    title: "3. Track Progress",
                    desc: "Monitor your application status in real-time"
                  }
                ].map((step, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-4">{step.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">{step.title}</h3>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Applications */}
          {activeTab === 'applications' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">My Applications</h2>
                <button 
                  onClick={() => setActiveTab('form')}
                  className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800"
                >
                  New Application
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Subject</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Submitted Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {[
                      {
                        id: "CL-2024-1001",
                        type: "RTI",
                        subject: "Information Request",
                        status: "Active",
                        date: "Jan 15, 2024"
                      },
                      {
                        id: "CL-2024-1002",
                        type: "Security Compliance",
                        subject: "Annual Audit",
                        status: "Under Review",
                        date: "Jan 10, 2024"
                      }
                    ].map((app, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 text-sm text-slate-600">{app.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{app.type}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{app.subject}</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{app.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Filing Instructions */}
          {activeTab === 'instructions' && (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-slate-800">Filing Instructions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-slate-800">Required Documents</h3>
                  <ul className="space-y-4">
                    {[
                      "Valid ID proof (Aadhar/PAN/Voter ID)",
                      "Address proof",
                      "Digital signature certificate",
                      "Supporting documents",
                      "Application fee payment receipt"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1" />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-slate-800">Important Guidelines</h3>
                  <ul className="space-y-4">
                    {[
                      "Keep file size under 5MB per document",
                      "Documents should be in PDF format",
                      "Information should be accurate and verifiable",
                      "Maintain a copy of all submissions",
                      "Track your application ID"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-blue-900 mr-2 mt-1" />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Track Status */}
          {activeTab === 'tracking' && (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-slate-800">Track Your Application</h2>
              <div className="max-w-xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Application ID
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-slate-300 rounded-md"
                      placeholder="Enter your application ID"
                    />
                  </div>
                  <button className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800">
                    Track Status
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* New Application Form */}
          {activeTab === 'form' && (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-slate-800">File New Application</h2>
              <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                {submitStatus.message && (
                  <div className={`mb-6 p-4 rounded-md ${
                    submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-md"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-md"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-md"
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit phone number"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Application Type</label>
                      <select 
                        name="applicationType"
                        value={formData.applicationType}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-md"
                      >
                        <option value="RTI Application">RTI Application</option>
                        <option value="Security Compliance">Security Compliance</option>
                        <option value="Legal Documentation">Legal Documentation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject Matter</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-md"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea 
                      rows="4" 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-md"
                      placeholder="Provide detailed information about your request"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Upload Documents
                      <span className="text-slate-500 text-xs ml-2">(PDF, DOC, DOCX, JPG, PNG - Max 5MB each)</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="file"
                        name="documents"
                        onChange={handleFileChange}
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="w-full p-3 border border-slate-300 rounded-md"
                      />
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-slate-700">Selected Files:</p>
                        <ul className="mt-1 space-y-1">
                          {selectedFiles.map((file, index) => (
                            <li key={index} className="flex items-center justify-between text-sm text-slate-600">
                              <span className="flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                {file.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {isSubmitting ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                    </div>
                  ) : (
                    <button 
                      type="submit" 
                      className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Submit Application
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CyberlawPortal;
