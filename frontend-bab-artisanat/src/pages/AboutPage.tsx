import { useState } from "react";
import { Link } from "react-router-dom";
import headerImage from "../assets/Zelij1.png";
import Artisans from "../assets/Artisans.png";
import Omar from "../assets/Omar.png";
import Laila from "../assets/Laila.png";
import Nadia from "../assets/Nadia.png";
import Showroom from "../assets/Showroom.png";
import { MapPin, Mail, Phone } from "lucide-react";

const AboutPage = () => {
  const [team, setTeam] = useState([
    {
      id: 1,
      name: "Laila Bennani",
      position: "Founder & CEO",
      bio: "With a passion for Moroccan heritage and 15 years in the artisanal sector, Laila established this platform to connect skilled artisans with global customers.",
      image: Laila
    },
    {
      id: 2,
      name: "Omar Alaoui",
      position: "Chief Curator",
      bio: "Omar travels across Morocco to discover exceptional artisans and their unique creations, ensuring our collection represents the finest of Moroccan craftsmanship.",
      image: Omar    },
    {
      id: 3,
      name: "Nadia El Fassi",
      position: "Artisan Relations",
      bio: "Coming from a family of artisans herself, Nadia builds meaningful relationships with our creator community, providing them with the support they need to thrive.",
      image: Nadia
    }
  ]);

  const [milestones, setMilestones] = useState([
    {
      year: "2015",
      title: "Our Journey Begins",
      description: "Starting with just 10 artisans from Fes, we launched our platform with a mission to preserve and promote Moroccan craftsmanship."
    },
    {
      year: "2018",
      title: "Expanding Horizons",
      description: "We expanded to over 100 artisans from across Morocco, representing all major crafting traditions from pottery to woodwork."
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Launched our online platform to connect Moroccan artisans directly with customers worldwide, especially during global challenges."
    },
    {
      year: "2022",
      title: "Artisan Education",
      description: "Established our Artisan Education Program to help craftspeople develop business skills alongside their traditional expertise."
    },
    {
      year: "2024",
      title: "Global Recognition",
      description: "Proudly recognized by UNESCO for our contributions to preserving intangible cultural heritage through sustainable commerce."
    }
  ]);

  return (
    <div className="bg-amber-50 text-stone-800">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden h-64 md:h-96">
        {/* Background Image with Light Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url(${headerImage})`,
            filter: "blur(2px)"
          }}
        ></div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 container px-4 mx-auto h-full flex items-center">
          <div className="md:max-w-3xl">
            <h1 className="text-3xl font-serif font-bold text-white leading-tight md:text-5xl lg:text-6xl mb-4"
              style={{ textShadow: "2px 2px 6px rgba(0, 0, 0, 0.5)" }}>
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-white leading-relaxed max-w-2xl"
              style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)" }}>
              Bridging tradition with modernity, connecting artisans with the world
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="lg:flex items-center">
            <div className="lg:w-1/2 lg:pr-16 mb-8 lg:mb-0">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-stone-600 mb-6">
                At the heart of our platform is a commitment to preserve and promote the rich tapestry of Moroccan craftsmanship while providing sustainable livelihoods for artisans across the country.
              </p>
              <p className="text-lg text-stone-600 mb-6">
                We believe that each handcrafted piece carries not just exceptional artistry, but also centuries of cultural heritage, stories, and techniques passed down through generations. Our mission is to ensure these traditions thrive in the modern world.
              </p>
              <p className="text-lg text-stone-600">
                By creating direct connections between skilled craftspeople and appreciative customers worldwide, we're building a marketplace that values authenticity, quality, and the human touch behind each creation.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={Artisans}
                  alt="Artisans at work" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-amber-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              The principles that guide our approach to preserving craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-4 text-center">Authenticity</h3>
              <p className="text-stone-600 text-center">
                We celebrate genuine craftsmanship, ensuring each piece reflects authentic Moroccan traditions and techniques. Every item tells a true story of cultural heritage.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">♻️</span>
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-4 text-center">Sustainability</h3>
              <p className="text-stone-600 text-center">
                We prioritize environmentally responsible practices, from sourcing natural materials to ensuring fair compensation for artisans, creating a sustainable ecosystem for craft preservation.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-4 text-center">Community</h3>
              <p className="text-stone-600 text-center">
                We foster meaningful connections between artisans and consumers, creating a global community that appreciates and supports the continuation of traditional crafts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              The key milestones that have shaped our mission to preserve Moroccan craftsmanship
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-amber-200 transform -translate-x-1/2"></div>
            
            {/* Timeline Items */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className={`relative flex md:items-center flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-amber-600 rounded-full border-4 border-white z-10"></div>
                  
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-amber-50 p-6 rounded-lg shadow-md inline-block">
                      <span className="text-amber-700 font-bold text-xl block mb-2">{milestone.year}</span>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">{milestone.title}</h3>
                      <p className="text-stone-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 md:invisible"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-stone-100">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              The passionate individuals dedicated to connecting artisans with the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div 
                key={member.id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="relative h-64">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-stone-800 mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-medium mb-4">{member.position}</p>
                  <p className="text-stone-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-amber-600 text-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-amber-50 max-w-2xl mx-auto">
              The difference we're making in preserving craftsmanship and supporting artisan communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <span className="block text-4xl md:text-5xl font-bold text-white mb-2">250+</span>
              <p className="text-amber-50 text-lg">Artisans Supported</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <span className="block text-4xl md:text-5xl font-bold text-white mb-2">12</span>
              <p className="text-amber-50 text-lg">Moroccan Regions</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <span className="block text-4xl md:text-5xl font-bold text-white mb-2">45%</span>
              <p className="text-amber-50 text-lg">Female Artisans</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <span className="block text-4xl md:text-5xl font-bold text-white mb-2">8,500+</span>
              <p className="text-amber-50 text-lg">Artisanal Items Sold</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Visit Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="lg:flex items-center gap-16">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-6">
                Visit Our Showroom
              </h2>
              <p className="text-lg text-stone-600 mb-8">
                Experience the beauty of Moroccan craftsmanship in person at our flagship showroom in Marrakech. Our knowledgeable staff will guide you through our collection and share the stories behind each piece.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <MapPin size={24} className="text-amber-600 mr-4 mt-1 flex-shrink-0" />
                  <p className="text-stone-600">
                    <span className="font-medium block text-stone-800">Our Showroom</span>
                    14 Rue Ibn Toumert, Medina<br />
                    Marrakech, Morocco
                  </p>
                </div>
                
                <div className="flex items-start">
                  <Phone size={24} className="text-amber-600 mr-4 mt-1 flex-shrink-0" />
                  <p className="text-stone-600">
                    <span className="font-medium block text-stone-800">Call Us</span>
                    +212 524 123 456
                  </p>
                </div>
                
                <div className="flex items-start">
                  <Mail size={24} className="text-amber-600 mr-4 mt-1 flex-shrink-0" />
                  <p className="text-stone-600">
                    <span className="font-medium block text-stone-800">Email Us</span>
                    contact@moroccanartisanat.com
                  </p>
                </div>
              </div>
              
              <Link to="/contact" className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-8 rounded-full shadow transition duration-300">
                Get In Touch
              </Link>
            </div>
            
            <div className="lg:w-1/2">
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={Showroom} 
                  alt="Our Marrakech showroom" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-amber-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Learn more about our mission, products, and the artisans we work with
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-stone-800 mb-3">How do you select the artisans you work with?</h3>
              <p className="text-stone-600">
                We carefully choose artisans based on their craft quality, commitment to traditional techniques, and dedication to their cultural heritage. We visit workshops across Morocco to find craftspeople who embody the authentic spirit of Moroccan artisanship.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-stone-800 mb-3">Are your products truly handmade?</h3>
              <p className="text-stone-600">
                Absolutely. Every item in our collection is handcrafted using traditional methods that have been passed down through generations. We pride ourselves on the authenticity of our pieces, with each carrying the unique signature of its maker.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-stone-800 mb-3">How do you ensure fair compensation for artisans?</h3>
              <p className="text-stone-600">
                We work directly with artisans, eliminating multiple intermediaries, to ensure they receive fair payment for their work. Our pricing reflects the true value of their labor, expertise, and the cultural significance of their craft. Additionally, we reinvest a portion of our proceeds into artisan community development.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-stone-800 mb-3">Do you ship internationally?</h3>
              <p className="text-stone-600">
                Yes, we ship to customers worldwide. Each item is carefully packaged to ensure it arrives safely, no matter the destination. International shipping times and costs vary depending on location, which you can view during checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-stone-800 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Become Part of Our Story
          </h2>
          <p className="text-lg text-stone-300 mb-8 max-w-2xl mx-auto">
            Join us in our mission to preserve Moroccan craftsmanship while bringing exceptional artisanal pieces into homes around the world
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/products" className="bg-amber-600 hover:bg-amber-700 text-white text-lg font-medium py-3 px-8 rounded-full shadow-lg transition duration-300">
              Shop Our Collection
            </Link>
            <Link to="/artisans" className="bg-transparent border-2 border-white hover:bg-white/10 text-white text-lg font-medium py-3 px-8 rounded-full shadow-lg transition duration-300">
              Meet the Artisans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;