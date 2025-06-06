
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { demoServices } from '@/lib/supabase';
import { Calendar, Clock, Star, ChevronRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Header />
      
      {/* Hero Section */}
      <section className="container-luxury py-20 lg:py-32">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-charcoal-800 mb-6">
            Welcome to{' '}
            <span className="text-gradient">Elysian Wellness</span>
          </h1>
          <p className="text-xl md:text-2xl text-charcoal-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience luxury wellness treatments designed to restore your mind, body, and spirit
            in our serene sanctuary of healing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="luxury-button text-lg px-8 py-6"
              asChild
            >
              <Link to="/auth">
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Appointment
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-lavender-300 text-lavender-700 hover:bg-lavender-50"
              asChild
            >
              <a href="#services">
                Explore Services
                <ChevronRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container-luxury py-20">
        <div className="text-center mb-16 animate-slide-in-left">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-charcoal-800 mb-4">
            Our Signature Services
          </h2>
          <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
            Discover our carefully curated wellness treatments, each designed to provide
            you with the ultimate relaxation and healing experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoServices.map((service, index) => (
            <Card 
              key={service.id} 
              className={`luxury-card hover-lift animate-scale-in animation-delay-${index * 200}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-lavender-100 text-lavender-700 hover:bg-lavender-200"
                  >
                    {service.category}
                  </Badge>
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm ml-1 text-charcoal-600">4.9</span>
                  </div>
                </div>
                <CardTitle className="font-playfair text-xl text-charcoal-800">
                  {service.name}
                </CardTitle>
                <CardDescription className="text-charcoal-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-charcoal-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{service.duration} min</span>
                  </div>
                  <span className="text-2xl font-bold text-lavender-600">
                    ${service.price}
                  </span>
                </div>
                <Button 
                  className="w-full luxury-button"
                  asChild
                >
                  <Link to="/auth">
                    Book Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white/50 py-20">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal-800 mb-6">
                Your Journey to Wellness Begins Here
              </h2>
              <p className="text-lg text-charcoal-600 mb-6 leading-relaxed">
                At Elysian Wellness, we believe that true wellness is achieved through the harmonious 
                balance of mind, body, and spirit. Our experienced practitioners use ancient wisdom 
                combined with modern techniques to create personalized treatment plans that address 
                your unique needs.
              </p>
              <p className="text-lg text-charcoal-600 mb-8 leading-relaxed">
                Step into our tranquil sanctuary and let us guide you on a transformative journey 
                toward optimal health and inner peace.
              </p>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-lavender-600 mb-2">500+</div>
                  <div className="text-sm text-charcoal-600">Happy Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-lavender-600 mb-2">5</div>
                  <div className="text-sm text-charcoal-600">Years Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-lavender-600 mb-2">98%</div>
                  <div className="text-sm text-charcoal-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>
            <div className="luxury-glass p-8 rounded-3xl animate-scale-in">
              <div className="bg-lavender-gradient p-6 rounded-2xl text-center">
                <h3 className="text-2xl font-playfair font-bold text-white mb-4">
                  Ready to Begin?
                </h3>
                <p className="text-lavender-100 mb-6">
                  Schedule your consultation today and take the first step toward 
                  a healthier, more balanced you.
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-lavender-700 hover:bg-pearl-50"
                  asChild
                >
                  <Link to="/auth">
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container-luxury py-20">
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal-800 mb-6">
            Visit Our Sanctuary
          </h2>
          <p className="text-lg text-charcoal-600 mb-12 max-w-2xl mx-auto">
            Located in the heart of the city, our wellness center offers a peaceful 
            escape from the everyday hustle and bustle.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="luxury-card p-6 text-center">
              <h3 className="font-playfair text-xl font-semibold text-charcoal-800 mb-2">
                Location
              </h3>
              <p className="text-charcoal-600">
                123 Wellness Boulevard<br />
                Serenity District, CA 90210
              </p>
            </div>
            <div className="luxury-card p-6 text-center">
              <h3 className="font-playfair text-xl font-semibold text-charcoal-800 mb-2">
                Hours
              </h3>
              <p className="text-charcoal-600">
                Monday - Friday: 8am - 8pm<br />
                Saturday - Sunday: 9am - 6pm
              </p>
            </div>
            <div className="luxury-card p-6 text-center">
              <h3 className="font-playfair text-xl font-semibold text-charcoal-800 mb-2">
                Contact
              </h3>
              <p className="text-charcoal-600">
                (555) 123-WELLNESS<br />
                hello@elysianwellness.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal-800 text-pearl-200 py-12">
        <div className="container-luxury text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-lavender-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-playfair text-xl font-semibold">
              Elysian Wellness
            </span>
          </div>
          <p className="text-pearl-400 mb-6">
            Your sanctuary for mind, body, and spirit wellness.
          </p>
          <p className="text-sm text-pearl-500">
            © 2024 Elysian Wellness. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
