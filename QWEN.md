# Maquillaje Profesional - MakeupByNuri Project Documentation

## Project Overview

This is a Next.js 15 application for "Maquillaje Profesional" (Professional Makeup), a website designed to promote professional makeup services. The site features an elegant and modern design with a pink and black color scheme, responsive layout, and various sections including hero, services, gallery, testimonials, and contact forms.

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS variables
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React
- **Database**: Prisma ORM with SQLite
- **Animations**: Framer Motion
- **State Management**: React Hooks (useState)

### Key Features
- Responsive design for all devices
- Image gallery with lightbox functionality
- Contact form with validation
- Service showcase with detailed descriptions
- Testimonials section
- Smooth scrolling navigation
- Dark/light mode support
- SEO optimization
- Accessibility features (WCAG compliant)

## Project Structure

```
/opt/MakeupByNuri/
├── .dockerignore
├── .gitignore
├── Caddyfile
├── components.json
├── CONFIGURACION_CONTACTO.md
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── db/
│   └── custom.db (SQLite database)
├── examples/
├── mini-services/
├── prisma/
│   └── schema.prisma
├── public/
│   └── images/ (hero, services, gallery)
├── src/
│   ├── app/ (Next.js App Router)
│   ├── components/ (React components)
│   ├── hooks/ (Custom React hooks)
│   └── lib/ (Utility functions)
```

## Building and Running

### Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# The app will be available at http://localhost:3000
```

### Production
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Database Management
```bash
# Push schema changes to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Create migrations
npm run db:migrate

# Reset database
npm run db:reset
```

## Configuration Files

### next.config.ts
- Output mode: "standalone" for easy deployment
- TypeScript errors are ignored during build
- ESLint errors are ignored during build
- React Strict Mode is disabled (due to nodemon handling recompilation)

### tailwind.config.ts
- Uses CSS variables for theme customization
- Dark mode enabled with "class" strategy
- Custom color palette with pink/neutral tones
- Border radius variables for consistent styling

### components.json
- shadcn/ui configuration with "new-york" style
- Uses Lucide icons
- Component aliases for easier imports:
  - `@/components` for UI components
  - `@/lib/utils` for utility functions
  - `@/components/ui` for shadcn/ui components
  - `@/lib` for utilities
  - `@/hooks` for custom hooks

### globals.css
- Uses Tailwind CSS with custom theme
- Implements pink and black color palette using oklch color space
- Dark mode support with different color values
- Custom scrollbar hiding for gallery

## Key Components and Features

### Page Structure (src/app/page.tsx)
- **Hero Section**: Full-screen image with call-to-action buttons
- **Features Section**: Highlights key benefits with icons
- **Services Section**: Shows different makeup services
- **Gallery Section**: Image gallery with lightbox modal
- **Testimonials**: Customer reviews with star ratings
- **Contact Section**: Contact form and information
- **Footer**: Contact links and social media

### Color Palette
- **Primary**: Pink tones (oklch(0.45 0.25 340) in light mode, oklch(0.65 0.2 330) in dark)
- **Background**: Pale pink in light mode (oklch(0.98 0.02 350)), black in dark (oklch(0.08 0 0))
- **Foreground**: Black in light mode (oklch(0.08 0 0)), pale pink in dark (oklch(0.98 0.02 350))
- **Accent**: Vibrant pink (oklch(0.65 0.2 330) in light, oklch(0.75 0.15 335) in dark)

### Image Management
Images for the website are organized in:
```
public/images/
├── hero/ (hero section images)
├── services/ (service images)
└── gallery/ (gallery images)
```

### Contact Information
The contact section includes placeholders for:
- Phone number
- Email address
- Business address
- Social media links (WhatsApp, Facebook, Instagram)

## Development Conventions

### File Naming
- Components use PascalCase (e.g., Button.tsx, Card.tsx)
- Pages use kebab-case or camelCase (e.g., page.tsx, layout.tsx)
- Utility functions use camelCase (e.g., cn.ts)

### TypeScript Usage
- Strict mode is enabled
- Type checking for props and state
- Component interfaces defined when needed

### Styling Approach
- Tailwind CSS utility classes with shadcn/ui components
- CSS variables for theme consistency
- Responsive design with mobile-first approach
- Dark mode support with class-based toggle

## Environment & Deployment

### Caddy Server Configuration
The Caddyfile sets up a reverse proxy to localhost:3000 with proper headers for forwarded requests. It also supports dynamic port transformation via query parameters.

### Standalone Output
The build configuration creates a standalone output which makes the application easier to deploy to various hosting platforms.

### Database
Uses Prisma with SQLite for data persistence. The schema includes basic models for User and Post entities, though the actual website functionality appears to be primarily static content with a contact form.

## Customization Points

1. **Colors**: Defined in `src/app/globals.css` using CSS variables
2. **Texts**: Modifiable directly in the components in `src/app/page.tsx`
3. **Images**: Replace files in `public/images/` directories
4. **Services**: Edit the `services` array in `src/app/page.tsx`
5. **Testimonials**: Edit the `testimonials` array in `src/app/page.tsx`
6. **Contact Information**: Update contact details in the contact section of `src/app/page.tsx`

## Performance Considerations

- Optimized image loading
- Responsive design for all screen sizes
- Minimal JavaScript for faster loading
- Lazy loading where appropriate
- CSS variables for efficient theme switching