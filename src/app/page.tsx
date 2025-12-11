'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Star, Phone, Mail, MapPin, Calendar, Heart, Sparkles, Clock, Users, MessageCircle, Facebook, Instagram, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

// Default fallback data (will be used until API data is loaded)
const DEFAULT_SERVICES: any[] = [];
const DEFAULT_GALLERY: any[] = [];

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false);
  const [isServiceDetailsOpen, setIsServiceDetailsOpen] = useState(false);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [selectedGalleryImageIndex, setSelectedGalleryImageIndex] = useState(0);
  const [services, setServices] = useState<any[]>(DEFAULT_SERVICES);
  const [gallery, setGallery] = useState<any[]>(DEFAULT_GALLERY);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Show success message
        alert('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        // Show error message
        alert('Error al enviar el mensaje: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const openServiceDetails = (index: number) => {
    setSelectedServiceIndex(index);
    setSelectedGalleryImageIndex(0); // Start with the first image in the gallery
    setIsServiceDetailsOpen(true);
  };

  const navigateServiceGallery = (direction: 'prev' | 'next') => {
    const currentService = services[selectedServiceIndex];
    if (!currentService || !currentService.gallery || currentService.gallery.length === 0) return; // If no gallery, do nothing

    if (direction === 'prev') {
      setSelectedGalleryImageIndex((prev) =>
        prev === 0 ? currentService.gallery.length - 1 : prev - 1
      );
    } else {
      setSelectedGalleryImageIndex((prev) =>
        prev === currentService.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Fetch categories and gallery images from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();

        // Fetch hero image
        const heroRes = await fetch('/api/images?type=hero');
        const heroData = await heroRes.json();

        // Set the hero image URL
        if (heroData.images && heroData.images.length > 0) {
          setHeroImageUrl(heroData.images[0].url);
        }

        // Sanitize category name for use in URL/path
        const sanitizeCategory = (str: string) => {
          return str
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscores
            .replace(/_+/g, '_') // Replace multiple underscores with single
            .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
        };

        // Create an array of promises to fetch images for each category
        const categoryImagePromises = categoriesData.categories.map((category: any) =>
          fetch(`/api/images?type=gallery&category=${encodeURIComponent(sanitizeCategory(category.name))}`).then(res => res.json())
        );

        // Wait for all image fetches to complete
        const categoryImageData = await Promise.all(categoryImagePromises);

        // Map categories to services format
        if (categoriesData.categories && categoriesData.categories.length > 0) {
          const mappedServices = categoriesData.categories.map((category: any, index: number) => ({
            title: category.name,
            description: `Servicios de ${category.name.toLowerCase()}`,
            image: categoryImageData[index]?.images[0]?.url || "/images/services/service-1.jpg",
            features: ["Profesional", "Personalizado", "De calidad"],
            gallery: categoryImageData[index]?.images
              .slice(0, 3)
              .map((img: any) => ({
                image: img.url,
                title: `${category.name}`,
                description: `Trabajo de ${category.name.toLowerCase()}`
              }))
          }));
          setServices(mappedServices);
        } else {
          // Fallback to default services
          setServices(defaultServices);
        }

        // For the main gallery, collect all images from all categories
        const allImages = categoryImageData.flatMap(data => data.images).filter(Boolean);

        if (allImages && allImages.length > 0) {
          const mappedGallery = allImages.map((img: any) => ({
            image: img.url,
            title: img.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
            description: "Trabajo profesional de maquillaje",
            duration: "1-2 horas",
            products: "Productos profesionales de alta calidad"
          }));
          setGallery(mappedGallery);
        } else {
          // Fallback to default gallery
          setGallery(defaultGallery);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use fallback data on error
        setServices(defaultServices);
        setGallery(defaultGallery);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Default fallback data
  const defaultServices = [
    {
      title: "Maquillaje de día",
      description: "Look natural y luminoso ideal para eventos diurnos con acabados frescos y de larga duración (35 €)",
      image: "/images/services/service-1.jpg",
      features: ["Duradero", "Personalizado", "Fresco"],
      gallery: [
        { 
          image: "/images/gallery/gallery-1.jpg", 
          title: "Maquillaje de día - Ejemplo 1",
          description: "Look natural y luminoso ideal para eventos diurnos con acabados frescos y de larga duración."
        },
        { 
          image: "/images/gallery/gallery-2.jpg", 
          title: "Maquillaje de día - Ejemplo 2",
          description: "Día luminoso con colores suaves y acabado natural."
        },
        { 
          image: "/images/gallery/gallery-3.jpg", 
          title: "Maquillaje de día - Ejemplo 3",
          description: "Look diurno con toques sutiles y acabado mate duradero."
        }
      ]
    },
    {
      title: "Maquillaje de noche",
      description: "Maquillaje intenso y llamativo para eventos nocturnos con iluminación dramática y colores vibrantes (45 €)",
      image: "/images/services/service-1.jpg",
      features: ["Efectos especiales", "Fotogénico", "Duradero"],
      gallery: [
        { 
          image: "/images/gallery/gallery-4.jpg", 
          title: "Maquillaje de noche - Ejemplo 1",
          description: "Look intenso y llamativo para eventos nocturnos con iluminación dramática."
        },
        { 
          image: "/images/gallery/gallery-5.jpg", 
          title: "Maquillaje de noche - Ejemplo 2",
          description: "Noche elegante con colores metalizados y acabado luminoso."
        },
        { 
          image: "/images/gallery/gallery-6.jpg", 
          title: "Maquillaje de noche - Ejemplo 3",
          description: "Diseño nocturno con tonos profundos y contorneado definido."
        }
      ]
    },
    {
      title: "Novia",
      description: "El día más especial merece un maquillaje impecable, duradero y fotogénico. Incluye prueba previa (<150 €)",
      image: "/images/services/service-1.jpg",
      features: ["Prueba incluida", "Resistente al agua", "Fotogénico"],
      gallery: [
        { 
          image: "/images/gallery/gallery-1.jpg", 
          title: "Maquillaje de Novia - Ejemplo 1",
          description: "El día más especial merece un maquillaje impecable, duradero y fotogénico."
        },
        { 
          image: "/images/gallery/gallery-2.jpg", 
          title: "Maquillaje de Novia - Ejemplo 2",
          description: "Look nupcial elegante con acabado fotogénico y duradero todo el día."
        },
        { 
          image: "/images/gallery/gallery-3.jpg", 
          title: "Maquillaje de Novia - Ejemplo 3",
          description: "Maquillaje de novia natural que resalta la belleza sin opacar el vestido."
        }
      ]
    },
    {
      title: "Invitadas",
      description: "Maquillaje elegante y personalizado para destacar en cualquier evento especial como boda, comunión o fiesta (40 €)",
      image: "/images/services/service-1.jpg",
      features: ["Elegante", "Personalizado", "Duradero"],
      gallery: [
        { 
          image: "/images/gallery/gallery-4.jpg", 
          title: "Maquillaje para Invitadas - Ejemplo 1",
          description: "Look elegante y personalizado para destacar en cualquier evento especial."
        },
        { 
          image: "/images/gallery/gallery-5.jpg", 
          title: "Maquillaje para Invitadas - Ejemplo 2",
          description: "Perfecto para eventos como bodas, comuniones o fiestas especiales."
        },
        { 
          image: "/images/gallery/gallery-6.jpg", 
          title: "Maquillaje para Invitadas - Ejemplo 3",
          description: "Diseño versátil que resalta la belleza natural de la invitada."
        }
      ]
    },
    {
      title: "Fallera",
      description: "Maquillaje tradicional para la festividad de las Fallas, con colores vivos y detalles que realzan la belleza del traje (45 €)",
      image: "/images/services/service-1.jpg",
      features: ["Tradicional", "Colores vivos", "Detallado"],
      gallery: [
        { 
          image: "/images/gallery/gallery-1.jpg", 
          title: "Maquillaje Fallera - Ejemplo 1",
          description: "Maquillaje tradicional para la festividad de las Fallas, con colores vivos."
        },
        { 
          image: "/images/gallery/gallery-2.jpg", 
          title: "Maquillaje Fallera - Ejemplo 2",
          description: "Detalles que realzan la belleza del traje con colores tradicionales."
        },
        { 
          image: "/images/gallery/gallery-3.jpg", 
          title: "Maquillaje Fallera - Ejemplo 3",
          description: "Look tradicional con acabados que complementan el vestuario fallero."
        }
      ]
    },
    {
      title: "Maquillaje artístico",
      description: "Diseños creativos y personalizados para ocasiones únicas, incluyendo efectos especiales y caracterizaciones (45€ - 70€)",
      image: "/images/services/service-1.jpg",
      features: ["Creativo", "Personalizado", "Profesional"],
      gallery: [
        { 
          image: "/images/gallery/gallery-4.jpg", 
          title: "Maquillaje Artístico - Ejemplo 1",
          description: "Diseños creativos y personalizados para ocasiones únicas."
        },
        { 
          image: "/images/gallery/gallery-5.jpg", 
          title: "Maquillaje Artístico - Ejemplo 2",
          description: "Incluyendo efectos especiales y caracterizaciones detalladas."
        },
        { 
          image: "/images/gallery/gallery-6.jpg", 
          title: "Maquillaje Artístico - Ejemplo 3",
          description: "Caracterizaciones profesionales para producciones y eventos temáticos."
        }
      ]
    }
  ];

  const defaultGallery = [
    {
      image: "/images/gallery/gallery-1.jpg",
      title: "Fallera",
      description: "Maquillaje tradicional para la festividad de las Fallas, con colores vivos y detalles que realzan la belleza del traje.",
      duration: "2 horas",
      products: "Foundation HD, Pigments profesionales, Fijador de larga duración"
    },
    { 
      image: "/images/gallery/gallery-2.jpg", 
      title: "Novia",
      description: "El día más especial merece un maquillaje impecable, duradero y fotogénico que resalte tu belleza natural.",
      duration: "1.5 horas",
      products: "Base ligera, Iluminador sutil, Labiales de larga duración"
    },
    { 
      image: "/images/gallery/gallery-1.jpg", 
      title: "Invitadas",
      description: "Maquillaje elegante y personalizado para destacar en cualquier evento especial como boda, comunión o fiesta.",
      duration: "1.5 horas",
      products: "Pigments profesionales, Colores tierra, Efectos especiales"
    },
    { 
      image: "/images/gallery/gallery-2.jpg", 
      title: "Evento día",
      description: "Look natural y luminoso ideal para eventos diurnos con acabados frescos y de larga duración.",
      duration: "1.5 horas",
      products: "Base mineral, Colores pastel, Máscara de pestañas waterproof"
    },
    { 
      image: "/images/gallery/gallery-1.jpg", 
      title: "Evento noche",
      description: "Maquillaje intenso y llamativo para eventos nocturnos con iluminación dramática y colores vibrantes.",
      duration: "2 horas",
      products: "Iluminadores premium, Sombras metálicas, Labios vinilos"
    },
    { 
      image: "/images/gallery/gallery-2.jpg", 
      title: "Fiestas especiales",
      description: "Diseños creativos y personalizados para ocasiones únicas, incluyendo efectos especiales y caracterizaciones.",
      duration: "2-3 horas",
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
            src={heroImageUrl || "/images/hero/hero-1.jpg"}
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
                  <a href="https://wa.me/34625253343" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-medium">
                      <MessageCircle className="w-6 h-6 mr-3" />
                      Reservar por WhatsApp
                      <div className="text-xs opacity-80 ml-auto">Recomendado</div>
                    </Button>
                  </a>
                  <a href="tel:+34625253343">
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
              const servicesSection = document.getElementById('services');
              servicesSection?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Ver Servicios
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
      <section id="services" className="py-20 px-4 bg-secondary/30">
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
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openServiceDetails(index)}>
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
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-primary/10 rounded-lg max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-3">Información adicional</h3>
            <p className="text-muted-foreground">Para maquillaje a domicilio se cobrará un plus dependiendo de la distancia.</p>
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
                  <span>‭+34 625 253 343‬</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>info@makeupbynuri.com</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Massanassa - Valencia</span>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-primary/10 rounded-lg">
                <h4 className="font-semibold mb-2">Horario de Atención</h4>
                <p className="text-sm text-muted-foreground">Lunes a Viernes: 10:00 - 20:00</p>
                <p className="text-sm text-muted-foreground">Sábados: 10:00 - 14:00</p>
                <p className="text-sm text-muted-foreground">Domingos: Cerrado</p>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="bg-secondary p-8 rounded-lg text-center">
                <h3 className="text-2xl font-semibold mb-4">Contáctanos por WhatsApp</h3>
                <p className="text-muted-foreground mb-6">Escríbenos directamente por WhatsApp para una respuesta inmediata. Puedes enviar fotos de referencia y resolver todas tus dudas.</p>
                
                <a href="https://wa.me/34625253343" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white text-lg py-6 w-full">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Enviar Mensaje por WhatsApp
                  </Button>
                </a>
                
                <p className="text-sm text-muted-foreground mt-4">Recibirás respuesta lo antes posible</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center mb-2">
              <img src="/logo.svg" alt="Maquillaje Profesional Logo" className="h-8 mr-2" />
              <h3 className="text-2xl font-bold">Maquillaje Profesional</h3>
            </div>
            <p className="text-sm opacity-80">Belleza que transforma</p>
          </div>
          
                  <div className="flex justify-center gap-6 mb-8">
            <a href="tel:+34625253343">
              <Button variant="ghost" size="sm" className="text-background hover:bg-background/20">
                <Phone className="w-4 h-4 mr-2" />
                Llamar
              </Button>
            </a>
            <a href="https://wa.me/34625253343" target="_blank" rel="noopener noreferrer">
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

      {/* Service Details Lightbox Modal */}
      <Dialog open={isServiceDetailsOpen} onOpenChange={setIsServiceDetailsOpen}>
        <DialogContent className="max-w-[98vw] w-full max-h-[95vh] p-0 overflow-hidden !max-w-none">
          <VisuallyHidden>
            <DialogTitle>Detalles del Servicio de Maquillaje</DialogTitle>
            <DialogDescription>
              Información detallada sobre el servicio de maquillaje seleccionado
            </DialogDescription>
          </VisuallyHidden>
          {services[selectedServiceIndex] && (
          <div className="flex flex-col h-[95vh] min-h-[500px]">
            {/* Top Carousel Section */}
            <div className="relative bg-black h-2/5 flex-shrink-0">
              {/* Main Image */}
              <div className="w-full h-full flex items-center justify-center p-4">
                <img
                  src={services[selectedServiceIndex]?.gallery?.[selectedGalleryImageIndex]?.image || services[selectedServiceIndex]?.image || ''}
                  alt={services[selectedServiceIndex]?.gallery?.[selectedGalleryImageIndex]?.title || services[selectedServiceIndex]?.title || ''}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Navigation Arrows */}
              <Button
                onClick={() => navigateServiceGallery('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                size="icon"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                onClick={() => navigateServiceGallery('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                size="icon"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Close Button */}
              <Button
                onClick={() => setIsServiceDetailsOpen(false)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                size="icon"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                {selectedGalleryImageIndex + 1} / {services[selectedServiceIndex]?.gallery?.length || 0}
              </div>

              {/* Horizontal Thumbnail Carousel */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {services[selectedServiceIndex]?.gallery?.map((galleryItem, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedGalleryImageIndex(index)}
                      className={`flex-shrink-0 relative overflow-hidden rounded border-2 transition-all ${
                        index === selectedGalleryImageIndex
                          ? 'border-primary scale-110'
                          : 'border-transparent hover:border-muted-foreground/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={galleryItem.image}
                        alt={galleryItem.title}
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
                        {services[selectedServiceIndex]?.gallery?.[selectedGalleryImageIndex]?.title || services[selectedServiceIndex]?.title || ''}
                      </h2>

                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {services[selectedServiceIndex]?.gallery?.[selectedGalleryImageIndex]?.description || services[selectedServiceIndex]?.description || ''}
                      </p>

                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">Características del servicio</h4>
                        <div className="flex flex-wrap gap-2">
                          {services[selectedServiceIndex].features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary">{feature}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Additional Content for Scroll Testing */}
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-semibold">Sobre este servicio</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Nuestro servicio de {services[selectedServiceIndex].title.toLowerCase()} está diseñado 
                          para realzar tu belleza natural y adaptarse a la ocasión especial. Cada servicio incluye 
                          una consulta personalizada para entender tus necesidades y preferencias específicas.
                        </p>

                        <h3 className="text-lg font-semibold">¿Qué puedes esperar?</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Durante tu servicio, dedicamos tiempo a preparar tu piel con productos de alta calidad 
                          antes de aplicar el maquillaje con técnicas especializadas. Utilizamos productos 
                          profesionales que garantizan un acabado impecable y duradero.
                        </p>

                        <h3 className="text-lg font-semibold">Consejos post-servicio</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Proporcionamos consejos personalizados para mantener tu look impecable durante 
                          todo el evento, incluyendo recomendaciones de productos y técnicas de retoque rápido 
                          si es necesario.
                        </p>
                      </div>

                      {/* Action Buttons - Now will scroll with the content on small screens */}
                      <div className="space-y-3 mt-6 lg:hidden"> {/* Hidden on large screens where they appear to the side */}
                        <a href="https://wa.me/34625253343" target="_blank" rel="noopener noreferrer">
                          <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-6">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Consultar este servicio
                          </Button>
                        </a>

                        <Button variant="outline" className="w-full py-6" onClick={() => setIsServiceDetailsOpen(false)}>
                          Ver otros servicios
                        </Button>

                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground text-center">
                            ¿Te gusta este servicio? Contáctanos para una consulta personalizada
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Sidebar on large screens */}
                    <div className="lg:w-80 lg:flex-shrink-0 hidden lg:block">
                      <div className="space-y-3 sticky top-0">
                        <a href="https://wa.me/34625253343" target="_blank" rel="noopener noreferrer">
                          <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-6">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Consultar este servicio
                          </Button>
                        </a>

                        <Button variant="outline" className="w-full py-6" onClick={() => setIsServiceDetailsOpen(false)}>
                          Ver otros servicios
                        </Button>

                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground text-center">
                            ¿Te gusta este servicio? Contáctanos para una consulta personalizada
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}