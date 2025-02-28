import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Scale, Shield, Book, Users, Phone, MapPin, Clock, Award, Star } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative">
        {/* Add a background image of a modern law office or courthouse
           File: hero-law-office.jpg
           Size: 1920x1080px
           Content: Professional law office or impressive courthouse facade */}
        <div 
          style={{
            backgroundImage: "url('images/lawoffice.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} 
          className="bg-gradient-to-r from-slate-900 to-blue-900 text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-blue-900/80"></div>
          <div className="container mx-auto px-4 py-24 relative">
            <div className="max-w-3xl">
              <div className="mb-4 text-yellow-500 font-semibold flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Trusted Legal Excellence Since 1995
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">Empowering Justice Through Legal Expertise</h1>
              <p className="text-xl text-slate-300 mb-8">
                Leading law firm specializing in RTI, cyber law, and regulatory compliance. 
                Over 25 years of excellence in legal services.
              </p>
              <div className="flex gap-4">
                <Link to="/consultation">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-8 py-4 rounded-md font-semibold flex items-center">
                    Free Consultation <ChevronRight className="ml-2" size={20} />
                  </button>
                </Link>
                <Link to="/services">
                  <button className="border-2 border-white hover:bg-white hover:text-slate-900 text-white px-8 py-4 rounded-md font-semibold transition-colors">
                    Our Services
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-8 -mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900 mb-2">25+</div>
              <div className="text-slate-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900 mb-2">10,000+</div>
              <div className="text-slate-600">Cases Won</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900 mb-2">98%</div>
              <div className="text-slate-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900 mb-2">5,000+</div>
              <div className="text-slate-600">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Areas */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Our Practice Areas</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Comprehensive legal solutions tailored to your specific needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Scale />,
                title: "RTI Services",
                desc: "Expert assistance in filing RTI applications with proven success rates",
                link: "/services/rti",
                // Add image: rti-services.jpg
                // Content: Documents, information access visuals
                image: "/images/rti.jpg"
              },
              {
                icon: <Shield />,
                title: "Cyber Law",
                desc: "Protection against cybercrime and digital rights violations",
                link: "/services/cyber-law",
                // Add image: cyber-law.jpg
                // Content: Digital security themed image
                image: "/images/cyberlaw.jpg"
              },
              {
                icon: <Book />,
                title: "Compliance",
                desc: "Ensuring your business meets all regulatory requirements",
                link: "/services/compliance",
                // Add image: compliance.jpg
                // Content: Professional reviewing documents
                image: "/images/compliance.jpg"
              }
            ].map((service, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-4">
                    <div className="text-white">{service.icon}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-slate-800">{service.title}</h3>
                  <p className="text-slate-600 mb-6">{service.desc}</p>
                  <a href={service.link} className="text-blue-900 font-semibold flex items-center hover:text-blue-700">
                    Learn More <ChevronRight className="ml-1" size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
<div className="relative bg-blue-900 text-white py-20">
  {/* Add background image:
     File: testimonial-bg.jpg
     Size: 1920x600px
     Content: Abstract professional background */}
  <div 
    style={{
      backgroundImage: "url('/images/testimonial-bg.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
    className="absolute inset-0 opacity-20"
  ></div>
  <div className="container mx-auto px-4 relative">
    <h2 className="text-3xl font-bold text-center mb-16">What Our Clients Say</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      {/*Testimonial*/}
      {/* Testimonial 1 */}
        <div className="bg-blue-800 p-8 rounded-lg">
          <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" />
                ))}
              </div>
              <p className="mb-6 text-slate-300">
                "Their expertise in corporate law is exceptional. The team provided timely advice that helped us navigate complex regulatory challenges during our expansion."
              </p>
              <div className="font-semibold">Rajiv Sharma</div>
              <div className="text-sm text-slate-300">CEO, TechVision India</div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-blue-800 p-8 rounded-lg">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" />
                ))}
              </div>
              <p className="mb-6 text-slate-300">
                "I was impressed by the personal attention and dedication shown by the team. They made a complex property dispute resolution seem effortless and secured our interests."
              </p>
              <div className="font-semibold">Priya Malhotra</div>
              <div className="text-sm text-slate-300">Real Estate Developer</div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-blue-800 p-8 rounded-lg">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" />
                ))}
              </div>
              <p className="mb-6 text-slate-300">
                "Their legal team demonstrated exceptional knowledge in intellectual property matters. They helped us secure patents for our innovations with strategic and practical guidance."
              </p>
              <div className="font-semibold">Vikram Patel</div>
              <div className="text-sm text-slate-300">Founder, Innovate Solutions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Awards Section */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4 text-slate-800">Recognition & Awards</h2>
              <p className="text-slate-600">
                Our commitment to excellence has been recognized by leading legal institutions
              </p>
            </div>
            <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Award 1 - 2020 */}
              <div className="flex flex-col items-center">
                <img
                  src="/images/awards1.jpg"
                  alt="Legal Excellence Award 2020"
                  className="w-24 h-24 mb-4"
                />
                <div className="text-center text-sm text-slate-600">
                  Excellence in Legal Services 2020
                </div>
              </div>

              {/* Award 2 - 2021 */}
              <div className="flex flex-col items-center">
                <img
                  src="/images/awards2.jpg"
                  alt="Legal Excellence Award 2021"
                  className="w-24 h-24 mb-4"
                />
                <div className="text-center text-sm text-slate-600">
                  Excellence in Legal Services 2021
                </div>
              </div>

              {/* Award 3 - 2022 */}
              <div className="flex flex-col items-center">
                <img
                  src="/images/awards3.jpg"
                  alt="Legal Excellence Award 2022"
                  className="w-24 h-24 mb-4"
                />
                <div className="text-center text-sm text-slate-600">
                  Excellence in Legal Services 2022
                </div>
              </div>

              {/* Award 4 - 2023 */}
              <div className="flex flex-col items-center">
                <img
                  src="/images/awards4.jpg"
                  alt="Legal Excellence Award 2023"
                  className="w-24 h-24 mb-4"
                />
                <div className="text-center text-sm text-slate-600">
                  Excellence in Legal Services 2023
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-blue-900 rounded-lg shadow-xl p-8 text-white relative overflow-hidden">
            {/* Add background image:
                File: contact-bg.jpg
                Size: 1200x400px
                Content: Abstract office or city view */}
            <div 
              style={{
                backgroundImage: "url('/images/contact-bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              className="absolute inset-0 opacity-10"
            ></div>
            <div className="relative">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Get Expert Legal Assistance</h2>
                <p className="text-slate-300">Schedule a free consultation with our legal experts</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-start space-x-4">
                  <Phone className="text-yellow-500 w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Call Us</h3>
                    <p className="text-slate-300">+91 123 456 7890</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="text-yellow-500 w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Visit Us</h3>
                    <p className="text-slate-300">123 Legal Avenue, New Delhi</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="text-yellow-500 w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Working Hours</h3>
                    <p className="text-slate-300">Mon - Fri: 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;