'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Star, Phone, Mail, MapPin, Calendar, Heart, Sparkles, Clock, Users, MessageCircle, Facebook, Instagram, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí iría la lógica de envío del formulario
  };

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  const navigateGallery = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
    } else {
      setSelectedImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
    }
  };

  const services = [
    {
      title: "Maquillaje Social",
      description: "Perfecto para eventos especiales, fiestas y reuniones importantes",
      image: "/images/services/service-1.jpg",
      features: ["Duradero", "Personalizado", "Alta calidad"]
    },
    {
      title: "Maquillaje de Novia",
      description: "Tu día especial merece un maquillaje impecable y emocionante",
      image: "/images/services/service-1.jpg",
      features: ["Prueba incluida", "Resistente al agua", "Fotográfico"]
    },
    {
      title: "Maquillaje Artístico",
      description: "Creatividad sin límites para producciones y eventos temáticos",
      image: "/images/services/service-1.jpg",
      features: ["Creativo", "Temático", "Profesional"]
    }
  ];

  const gallery = [
    { 
      image: "/images/gallery/gallery-1.jpg", 
      title: "Maquillaje Profesional Ejemplo 1",
      description: "Ejemplo de nuestro trabajo profesional de maquillaje. Cada look es único y personalizado según las necesidades y preferencias de la clienta.",
      duration: "2 horas",
      products: "Foundation HD, Pigments profesionales, Fijador de larga duración"
    },
    { 
      image: "/images/gallery/gallery-2.jpg", 
      title: "Maquillaje Profesional Ejemplo 2",
      description: "Demostración de técnicas avanzadas de maquillaje con productos de alta calidad para resultados duraderos y naturales.",
      duration: "1.5 horas",
      products: "Base ligera, Iluminador sutil, Labiales de larga duración"
    },
    { 
      image: "/images/gallery/gallery-1.jpg", 
      title: "Maquillaje Profesional Ejemplo 3",
      description: "Trabajo profesional destacando la importancia de la preparación de la piel y la elección correcta de tonos.",
      duration: "2.5 horas",
      products: "Pigments profesionales, Glitters, Colores intensos, Efectos especiales"
    },
    { 
      image: "/images/gallery/gallery-2.jpg", 
      title: "Maquillaje Profesional Ejemplo 4",
      description: "Ejemplo de maquillaje para evento especial, combinando elegancia y duración para largas jornadas.",
      duration: "1.5 horas",
      products: "Base mineral, Colores tierra, Máscara de pestañas waterproof"
    },
    { 
      image: "/images/gallery/gallery-1.jpg", 
      title: "Maquillaje Profesional Ejemplo 5",
      description: "Técnica de contouring y iluminación para resaltar los mejores rasgos faciales con resultado natural.",
      duration: "2 horas",
      products: "Iluminadores premium, Sombras metálicas, Labios vinilos"
    },
    { 
      image: "/images/gallery/gallery-2.jpg", 
      title: "Maquillaje Profesional Ejemplo 6",
      description: "Finalización del maquillaje profesional con detalles de precisión y productos de última generación.",
      duration: "3 horas",
      products: "Efectos 3D, Body painting, Prostéticos, Aerógrafo profesional"
    }
  ];

  const testimonials = [
    {
      name: "María González",
      text: "Absolutamente maravillosa. Mi maquillaje de boda fue perfecto y duró todo el día.",
      rating: 5
    },
    {
      name: "Ana Rodríguez",
      text: "Profesionalismo y atención al detalle increíbles. Me sentí hermosa en mi evento.",
      rating: 5
    },
    {
      name: "Carmen López",
      text: "Experiencia demostrable y resultados que hablan por sí solos. Totalmente recomendada.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero/hero-1.jpg" 
            alt="Maquillaje Profesional"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <Badge className="mb-4 bg-accent text-accent-foreground text-sm px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Maquillaje Profesional
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Belleza que
            <span className="text-accent block">Transforma</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Experiencia demostrable para todo tipo de eventos con resultados duraderos y atención personalizada
          </p>
          
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={isReserveDialogOpen} onOpenChange={setIsReserveDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-medium">
                  <Calendar className="w-5 h-5 mr-2" />
                  Reservar Cita
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center">Reservar Cita</DialogTitle>
                  <DialogDescription className="text-center text-base">
                    Elige tu forma preferida de contacto para agendar tu cita de maquillaje
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <a href="https://wa.me/TU_NUMERO_TELEFONO" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-medium">
                      <MessageCircle className="w-6 h-6 mr-3" />
                      Reservar por WhatsApp
                      <div className="text-xs opacity-80 ml-auto">Recomendado</div>
                    </Button>
                  </a>
                  <a href="tel:TU_NUMERO_TELEFONO">
                    <Button variant="outline" className="w-full border-2 py-6 text-lg font-medium hover:bg-accent hover:text-accent-foreground">
                      <Phone className="w-6 h-6 mr-3" />
                      Llamar Ahora
                    </Button>
                  </a>
                  <div className="text-center text-sm text-muted-foreground pt-2">
                    <p>💬 WhatsApp: Envía fotos de referencia</p>
                    <p>📞 Teléfono: Atención inmediata</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button size="lg" variant="outline" className="border-white bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black px-8 py-6 text-lg font-medium" onClick={() => {
              const gallerySection = document.getElementById('gallery');
              gallerySection?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Ver Trabajos
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mucho mimo y cuidado</h3>
              <p className="text-muted-foreground">Tratamiento personalizado con productos de alta calidad</p>
            </Card>
            
            <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Todo tipo de edades</h3>
              <p className="text-muted-foreground">Servicios adaptados para cada etapa de la vida</p>
            </Card>
            
            <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resultados duraderos</h3>
              <p className="text-muted-foreground">Maquillaje que permanece perfecto todo el evento</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary text-primary-foreground">Servicios</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Para todo tipo de
              <span className="text-primary block">Eventos</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Atención personalizada con experiencia demostrable en cada servicio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary">{feature}</Badge>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Consultar por WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary text-primary-foreground">Galería</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Nuestros
              <span className="text-primary block">Trabajos</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Una muestra de nuestra experiencia y dedicación en cada detalle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gallery.map((item, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg cursor-pointer" onClick={() => openGallery(index)}>
                <img 
                  src={item.image} 
                  alt={`Trabajo de maquillaje ${item.title}`}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                    <div className="flex items-center text-white/80 text-sm mt-1">
                      <ZoomIn className="w-4 h-4 mr-1" />
                      Click para ver detalles
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary text-primary-foreground">Testimonios</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Clientes
              <span className="text-primary block">Felices</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary text-primary-foreground">Contacto</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Hagamos
              <span className="text-primary block">Magia</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Contáctanos para una consulta personalizada y descubre cómo podemos realzar tu belleza natural
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Información de Contacto</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+34 600 000 000</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>info@maquillajeprofesional.com</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Calle Principal 123, Ciudad</span>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-primary/10 rounded-lg">
                <h4 className="font-semibold mb-2">Horario de Atención</h4>
                <p className="text-sm text-muted-foreground">Lunes a Viernes: 10:00 - 20:00</p>
                <p className="text-sm text-muted-foreground">Sábados: 10:00 - 14:00</p>
                <p className="text-sm text-muted-foreground">Domingos: Cerrado</p>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Envíanos un Mensaje</CardTitle>
                <CardDescription>
                  Responde lo antes posible con toda la información que necesites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <Input
                    name="email"
                    type="email"
                    placeholder="Tu email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <Input
                    name="phone"
                    placeholder="Tu teléfono"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  
                  <Textarea
                    name="message"
                    placeholder="Cuéntanos sobre tu evento..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Maquillaje Profesional</h3>
            <p className="text-sm opacity-80">Belleza que transforma</p>
          </div>
          
                  <div className="flex justify-center gap-6 mb-8">
            <a href="tel:TU_NUMERO_TELEFONO">
              <Button variant="ghost" size="sm" className="text-background hover:bg-background/20">
                <Phone className="w-4 h-4 mr-2" />
                Llamar
              </Button>
            </a>
            <a href="https://wa.me/TU_NUMERO_TELEFONO" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-background hover:bg-background/20">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </a>
            <a href="https://facebook.com/TU_PAGINA_FACEBOOK" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-background hover:bg-background/20">
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
            </a>
            <a href="https://instagram.com/TU_PERFIL_INSTAGRAM" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-background hover:bg-background/20">
                <Instagram className="w-4 h-4 mr-2" />
                Instagram
              </Button>
            </a>
          </div>
          
          <div className="text-sm opacity-60">
            © 2024 Maquillaje Profesional. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* Gallery Lightbox Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-[98vw] w-full max-h-[95vh] p-0 overflow-hidden !max-w-none">
          <VisuallyHidden>
            <DialogTitle>Galería de Trabajos de Maquillaje</DialogTitle>
            <DialogDescription>
              Vista detallada de nuestros trabajos de maquillaje profesional con información sobre productos y duración
            </DialogDescription>
          </VisuallyHidden>
          <div className="flex flex-col h-[95vh] min-h-[500px]">
            {/* Top Carousel Section */}
            <div className="relative bg-black h-2/5 flex-shrink-0">
              {/* Main Image */}
              <div className="w-full h-full flex items-center justify-center p-4">
                <img
                  src={gallery[selectedImageIndex].image}
                  alt={gallery[selectedImageIndex].title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Navigation Arrows */}
              <Button
                onClick={() => navigateGallery('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                size="icon"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                onClick={() => navigateGallery('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                size="icon"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Close Button */}
              <Button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                size="icon"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                {selectedImageIndex + 1} / {gallery.length}
              </div>

              {/* Horizontal Thumbnail Carousel */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {gallery.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 relative overflow-hidden rounded border-2 transition-all ${
                        index === selectedImageIndex
                          ? 'border-primary scale-110'
                          : 'border-transparent hover:border-muted-foreground/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Content Section */}
            <div className="flex-1 bg-background overflow-hidden flex flex-col">
              <div className="w-full overflow-y-auto">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row gap-6 max-w-full">
                    {/* Main Content - Now includes both text and buttons that will scroll together */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl md:text-2xl font-bold mb-4">
                        {gallery[selectedImageIndex].title}
                      </h2>

                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {gallery[selectedImageIndex].description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold">Duración</h4>
                            <p className="text-sm text-muted-foreground">{gallery[selectedImageIndex].duration}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold">Productos Utilizados</h4>
                            <p className="text-sm text-muted-foreground">{gallery[selectedImageIndex].products}</p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Content for Scroll Testing */}
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-semibold">Sobre este trabajo</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Este maquillaje profesional representa la calidad y dedicación que ponemos en cada trabajo.
                          Utilizamos técnicas avanzadas y productos de primera calidad para garantizar resultados
                          excepcionales que duren todo el evento.
                        </p>

                        <h3 className="text-lg font-semibold">Proceso de trabajo</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Comenzamos con una consulta personalizada para entender tus necesidades y preferencias.
                          Luego preparamos la piel con productos de alta calidad antes de aplicar el maquillaje
                          con técnicas especializadas.
                        </p>

                        <h3 className="text-lg font-semibold">Mantenimiento y consejos</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Proporcionamos consejos personalizados para mantener el maquillaje impecable durante
                          todo el evento, incluyendo recomendaciones de productos y técnicas de retoque rápido.
                        </p>
                      </div>

                      {/* Action Buttons - Now will scroll with the content on small screens */}
                      <div className="space-y-3 mt-6 lg:hidden"> {/* Hidden on large screens where they appear to the side */}
                        <a href="https://wa.me/TU_NUMERO_TELEFONO" target="_blank" rel="noopener noreferrer">
                          <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-6">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Consultar este look
                          </Button>
                        </a>

                        <Button variant="outline" className="w-full py-6" onClick={() => setIsGalleryOpen(false)}>
                          Ver más trabajos
                        </Button>

                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground text-center">
                            ¿Te gusta este estilo? Contáctanos para una consulta personalizada
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Sidebar on large screens */}
                    <div className="lg:w-80 lg:flex-shrink-0 hidden lg:block">
                      <div className="space-y-3 sticky top-0">
                        <a href="https://wa.me/TU_NUMERO_TELEFONO" target="_blank" rel="noopener noreferrer">
                          <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-6">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Consultar este look
                          </Button>
                        </a>

                        <Button variant="outline" className="w-full py-6" onClick={() => setIsGalleryOpen(false)}>
                          Ver más trabajos
                        </Button>

                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground text-center">
                            ¿Te gusta este estilo? Contáctanos para una consulta personalizada
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}