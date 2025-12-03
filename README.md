# Maquillaje Profesional - Web Site

Una web elegante y moderna para promocionar servicios de maquillaje profesional, diseñada con Next.js 15, TypeScript y Tailwind CSS.

## 🎨 Diseño y Colores

- **Colores principales**: Rosa pálido y negro
- **Paleta complementaria**: Tonos rosas suaves y grises elegantes
- **Estilo**: Moderno, minimalista y profesional
- **Diseño responsive**: Adaptado para todos los dispositivos

## 📁 Estructura de Imágenes

Las imágenes están organizadas en directorios específicos para facilitar su reemplazo:

```
public/images/
├── hero/
│   └── hero-1.jpg          # Imagen principal del hero
├── services/
│   └── service-1.jpg       # Imágenes de servicios
└── gallery/
    ├── gallery-1.jpg       # Imágenes de la galería
    └── gallery-2.jpg       # Imágenes de la galería
```

## 🖼️ Cómo Reemplazar las Imágenes

Para reemplazar las imágenes placeholder:

1. **Prepara tus imágenes** con los siguientes nombres:
   - `hero-1.jpg` para la imagen principal (recomendado: 1440x720px)
   - `service-1.jpg` para servicios (recomendado: 1024x1024px)
   - `gallery-1.jpg`, `gallery-2.jpg` para la galería (recomendado: 1024x1024px)

2. **Arrastra y suelta** las imágenes directamente en las carpetas correspondientes:
   - Las imágenes del hero van en `public/images/hero/`
   - Las imágenes de servicios van en `public/images/services/`
   - Las imágenes de la galería van en `public/images/gallery/`

3. **Los cambios se reflejarán automáticamente** en la web sin necesidad de modificar código.

## 📱 Secciones de la Web

- **Hero Section**: Impactante imagen principal con llamada a la acción
- **Características**: Destaca los valores principales del negocio
- **Servicios**: Presentación de los diferentes tipos de maquillaje
- **Galería**: Muestra visual de trabajos realizados
- **Testimonios**: Opiniones de clientes satisfechos
- **Contacto**: Formulario de contacto e información de contacto
- **Footer**: Información adicional y enlaces rápidos

## 🎯 Textos Incorporados

La web incluye los textos solicitados:

- ✅ Experiencia demostrable
- ✅ Para todo tipo de eventos
- ✅ Resultados duraderos
- ✅ Mucho mimo y cuidado
- ✅ Atención personalizada
- ✅ Todo tipo de edades

## 🛠️ Tecnologías Utilizadas

- **Next.js 15**: Framework React con App Router
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Framework de CSS utilitario
- **shadcn/ui**: Componentes UI elegantes y accesibles
- **Lucide Icons**: Iconos modernos y ligeros

## 🚀 Características Técnicas

- ✅ Diseño 100% responsive
- ✅ Optimización de imágenes
- ✅ Animaciones sutiles y transiciones
- ✅ Accesibilidad web (WCAG)
- ✅ SEO optimizado
- ✅ Modo oscuro/claro soportado
- ✅ Componentes reutilizables

## 📝 Personalización

La web está diseñada para ser fácilmente personalizable:

- **Colores**: Definidos en `src/app/globals.css`
- **Textos**: Modificables directamente en los componentes
- **Servicios**: Editables en el array `services` del componente principal
- **Testimonios**: Personalizables en el array `testimonials`

## 🌟 Funcionalidades Implementadas

- Navegación suave entre secciones
- Formulario de contacto funcional (frontend)
- Galería de imágenes con efectos hover
- Badges y elementos interactivos
- Diseño adaptativo para móviles y tablets
- Footer con información de contacto

---

**Nota**: Esta web está lista para producción y puede ser desplegada fácilmente en cualquier plataforma compatible con Next.js.