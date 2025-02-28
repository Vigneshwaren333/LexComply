import React, { useState } from 'react';
import axios from 'axios';
import { FileText, ClipboardCheck, Clock, AlertCircle, ChevronRight, CheckCircle } from 'lucide-react';

const RTIPage = () => {
  const [activeTab, setActiveTab] = useState('process');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idProofType: 'Aadhar Card',
    publicAuthority: '',
    subjectMatter: '',
    informationRequired: '',
    timePeriodStart: '',
    timePeriodEnd: '',
    documents: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? (name === 'documents' ? files : files[0]) : value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.publicAuthority) newErrors.publicAuthority = 'Public authority is required';
    if (!formData.subjectMatter) newErrors.subjectMatter = 'Subject matter is required';
    if (!formData.informationRequired) newErrors.informationRequired = 'Information required is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          if (key === 'documents' && formData[key]) {
            for (let i = 0; i < formData[key].length; i++) {
              formDataToSend.append('documents', formData[key][i]);
            }
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      const response = await axios.post('http://localhost:5000/api/rti/submit', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert(`Application submitted successfully! Your application ID is: ${response.data.applicationId}`);
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          idProofType: 'Aadhar Card',
          publicAuthority: '',
          subjectMatter: '',
          informationRequired: '',
          timePeriodStart: '',
          timePeriodEnd: '',
          documents: null
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
  {/* Hero Section */}
      <div className="relative">
        <div 
          className="bg-blue-900 text-white py-16 bg-cover bg-center relative"
          style={{ backgroundImage: "url('/images/rti.jpg')" }}
        >
      {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-blue-900 opacity-60"></div>

          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl font-bold mb-4">RTI Services</h1>
            <p className="text-xl text-slate-300">
              Expert assistance in filing and tracking RTI applications
            </p>
          </div>
        </div>
      </div>



      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          {[
            { id: 'process', label: 'RTI Process' },
            { id: 'applications', label: 'My Applications' },
            { id: 'instructions', label: 'Filing Instructions' },
            { id: 'tracking', label: 'Track Status' },
            { id: 'form', label: 'File RTI' }
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
          {/* RTI Process */}
          {activeTab === 'process' && (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-slate-800">RTI Application Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <FileText className="w-8 h-8 text-blue-900" />,
                    title: "1. File Application",
                    desc: "Fill out the RTI application form with required details"
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Subject</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Filed Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {[1, 2, 3].map((_, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 text-sm text-slate-600">RTI-2024-{1000 + idx}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">Information Request</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">Jan 15, 2024</td>
                        <td className="px-6 py-4">
                          <button className="text-blue-900 hover:text-blue-700">View Details</button>
                        </td>
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
              <h2 className="text-2xl font-bold mb-8 text-slate-800">RTI Filing Instructions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-slate-800">Required Documents</h3>
                  <ul className="space-y-4">
                    {[
                      "Valid ID proof (Aadhar/PAN/Voter ID)",
                      "Residential proof",
                      "Recent photograph",
                      "Application fee payment receipt",
                      "Supporting documents (if any)"
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
                      "Be specific about the information you seek",
                      "Mention the time period for which information is required",
                      "Write questions clearly and concisely",
                      "Avoid asking for opinions or explanations",
                      "Keep a copy of your application"
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
                      placeholder="Enter your RTI application ID"
                    />
                  </div>
                  <button className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800">
                    Track Status
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* RTI Form */}
          {activeTab === 'form' && (
  <div>
    <h2 className="text-2xl font-bold mb-8 text-slate-800">File RTI Application</h2>
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.fullName ? 'border-red-500' : 'border-slate-300'} rounded-md`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-md`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-slate-300'} rounded-md`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">ID Proof Type</label>
            <select 
              name="idProofType"
              value={formData.idProofType}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-md"
            >
              <option>Aadhar Card</option>
              <option>PAN Card</option>
              <option>Voter ID</option>
            </select>
          </div>
        </div>

       {/* Previous code continues... */}

       <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Public Authority</label>
                    <input 
                      type="text" 
                      name="publicAuthority"
                      value={formData.publicAuthority}
                      onChange={handleChange}
                      className={`w-full p-3 border ${errors.publicAuthority ? 'border-red-500' : 'border-slate-300'} rounded-md`}
                    />
                    {errors.publicAuthority && <p className="text-red-500 text-sm mt-1">{errors.publicAuthority}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject Matter</label>
                    <input 
                      type="text" 
                      name="subjectMatter"
                      value={formData.subjectMatter}
                      onChange={handleChange}
                      className={`w-full p-3 border ${errors.subjectMatter ? 'border-red-500' : 'border-slate-300'} rounded-md`}
                    />
                    {errors.subjectMatter && <p className="text-red-500 text-sm mt-1">{errors.subjectMatter}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Information Required</label>
                    <textarea 
                      rows="4" 
                      name="informationRequired"
                      value={formData.informationRequired}
                      onChange={handleChange}
                      className={`w-full p-3 border ${errors.informationRequired ? 'border-red-500' : 'border-slate-300'} rounded-md`}
                    ></textarea>
                    {errors.informationRequired && <p className="text-red-500 text-sm mt-1">{errors.informationRequired}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Time Period</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="date" 
                        name="timePeriodStart"
                        value={formData.timePeriodStart}
                        onChange={handleChange}
                        className="p-3 border border-slate-300 rounded-md"
                      />
                      <input 
                        type="date" 
                        name="timePeriodEnd"
                        value={formData.timePeriodEnd}
                        onChange={handleChange}
                        className="p-3 border border-slate-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Upload Documents</label>
                    <input 
                      type="file" 
                      name="documents"
                      onChange={handleChange}
                      className="w-full p-3 border border-slate-300 rounded-md" 
                      multiple 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className={`w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
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

export default RTIPage;