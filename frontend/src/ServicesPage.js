import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Shield, Book, ChevronRight, Users, Award, Briefcase, Globe } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      icon: <Scale className="w-12 h-12" />,
      title: "RTI Services",
      description: "Expert assistance in filing RTI applications with proven success rates. Our team helps you navigate the complexities of information requests and ensures maximum transparency.",
      features: ["RTI Application Filing", "Appeal Assistance", "Document Review", "Strategic Guidance"],
      link: "/services/rti"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Cyber Law",
      description: "Comprehensive protection against cybercrime and digital rights violations. We provide expert legal support for all cyber-related issues.",
      features: ["Cybercrime Defense", "Digital Rights Protection", "Online Privacy", "Data Security Compliance"],
      link: "/services/cyber-law"
    },
    {
      icon: <Book className="w-12 h-12" />,
      title: "Compliance",
      description: "Ensuring your business meets all regulatory requirements. Our compliance services help you stay ahead of changing regulations.",
      features: ["Regulatory Compliance", "Policy Development", "Risk Assessment", "Compliance Training"],
      link: "/services/compliance"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Our Legal Services</h1>
          <p className="text-xl text-slate-300">Comprehensive legal solutions tailored to your needs</p>
        </div>
      </div>

      {/* About Us Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-slate-800">About Our Firm</h2>
              <div className="space-y-4">
                <p className="text-slate-600">
                  With over 25 years of experience, our law firm has established itself as a leading name in RTI, cyber law, and regulatory compliance. Our commitment to excellence and client success has earned us recognition across the industry.
                </p>
                <p className="text-slate-600">
                  We combine deep legal expertise with a modern approach to deliver exceptional results for our clients. Our team of experienced attorneys and legal professionals is dedicated to providing personalized solutions for every case.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="flex items-center space-x-3">
                  <Users className="text-blue-900 w-8 h-8" />
                  <div>
                    <div className="font-bold text-2xl text-blue-900">5000+</div>
                    <div className="text-slate-600">Clients Served</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="text-blue-900 w-8 h-8" />
                  <div>
                    <div className="font-bold text-2xl text-blue-900">98%</div>
                    <div className="text-slate-600">Success Rate</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="text-blue-900 w-8 h-8" />
                  <div>
                    <div className="font-bold text-2xl text-blue-900">25+</div>
                    <div className="text-slate-600">Years Experience</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="text-blue-900 w-8 h-8" />
                  <div>
                    <div className="font-bold text-2xl text-blue-900">50+</div>
                    <div className="text-slate-600">Cities Covered</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-900 to-slate-900 p-6 rounded-lg text-white">
                <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                <p className="text-slate-300">To provide accessible, efficient, and effective legal solutions while maintaining the highest standards of professional integrity.</p>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-6 rounded-lg text-white">
                <h3 className="text-xl font-bold mb-2">Our Vision</h3>
                <p className="text-slate-300">To be the most trusted legal partner, known for excellence, innovation, and client satisfaction.</p>
              </div>
              <div className="col-span-2 bg-gradient-to-r from-slate-900 to-blue-900 p-6 rounded-lg text-white">
                <h3 className="text-xl font-bold mb-2">Our Values</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Integrity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Excellence</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Innovation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Client Focus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

            {/* Services Section */}
    <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-slate-800">Our Legal Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <div className="text-yellow-500 mb-6">{service.icon}</div>
                <h2 className="text-2xl font-bold mb-4 text-slate-800">{service.title}</h2>
                <p className="text-slate-600 mb-6">{service.description}</p>
                
                <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-slate-700">Key Features:</h3>
                <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-slate-600">
                        <ChevronRight className="w-4 h-4 text-yellow-500 mr-2" />
                        {feature}
                    </li>
                    ))}
                </ul>
                </div>

                <div className="mt-auto">
                <Link 
                    to={service.link}
                    className="inline-flex items-center bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-800 hover:to-blue-600 transition-all duration-300"
                >
                    Learn More <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
                </div>
            </div>
            ))}
        </div>

        {/* Additional Services Highlight */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 to-blue-900 rounded-xl p-8 text-white">
            <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Additional Legal Support</h3>
            <p className="text-slate-300">Beyond our core services, we also provide assistance in:</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
                {
                title: "Corporate Law",
                description: "Business registration and compliance"
                },
                {
                title: "Intellectual Property",
                description: "Trademark and copyright protection"
                },
                {
                title: "Legal Consultation",
                description: "Expert advice and guidance"
                },
                {
                title: "Document Review",
                description: "Thorough legal document analysis"
                }
            ].map((item, index) => (
                <div key={index} className="bg-white bg-opacity-10 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-slate-300">{item.description}</p>
                </div>
            ))}
            </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Ready to Get Started?</h3>
            <p className="text-slate-600 mb-8">Schedule a consultation with our legal experts today</p>
            <Link 
            to="/consultation"
            className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-8 py-4 rounded-lg font-semibold transition-colors"
            >
            Book Free Consultation <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
        </div>
        </div>
        </div>
  )
}

export default ServicesPage;
