# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MakeupByNuri is a professional makeup artist portfolio and booking website built with Next.js 15, TypeScript, and Tailwind CSS. The site features a pink and black color scheme and includes a service showcase, gallery with lightbox, contact options via WhatsApp/phone, and testimonials.

## Development Commands

### Local Development
```bash
npm run dev              # Start dev server on port 3000 (logs to dev.log)
npm run build            # Build for production with standalone output
npm run start            # Start production server (logs to server.log)
npm run lint             # Run ESLint
```

### Database (Prisma)
```bash
npm run db:push          # Push schema changes to database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations in dev mode
npm run db:reset         # Reset database (WARNING: destructive)
```

### Docker Deployment
```bash
# Build and run with Docker
docker build -t makeupbynuri .
docker run -d --name makeupbynuri-app -p 3003:3000 makeupbynuri

# Update deployment
docker stop makeupbynuri-app && docker rm makeupbynuri-app
docker build -t makeupbynuri .
docker run -d --name makeupbynuri-app -p 3003:3000 makeupbynuri

# View logs
docker logs makeupbynuri-app
```

See DOCKER_SETUP.md for full nginx/SSL setup instructions.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router, React Server Components)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Database**: Prisma ORM with SQLite
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Deployment**: Docker with standalone output mode

### Project Structure
```
src/
├── app/
│   ├── page.tsx              # Main landing page (client component)
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles with CSS variables
│   └── api/route.ts          # API route example
├── components/ui/            # shadcn/ui components (50+ components)
├── lib/
│   ├── db.ts                 # Prisma client singleton
│   └── utils.ts              # cn() utility for class merging
└── hooks/                    # Custom React hooks
```

### Key Application Features

**Main Page (src/app/page.tsx)**:
- Client component with multiple sections: hero, features, services, gallery, testimonials, contact
- Gallery lightbox with navigation (ChevronLeft/ChevronRight, keyboard support)
- Booking dialog with WhatsApp (recommended) and phone contact options
- Smooth scroll navigation to sections (#gallery, #contact)
- All contact links are placeholders (TU_NUMERO_TELEFONO, TU_PAGINA_FACEBOOK, etc.) - see CONFIGURACION_CONTACTO.md

**Image Management**:
- Images stored in `public/images/` with subdirectories: hero/, services/, gallery/
- Service images: `/images/services/service-1.jpg` (1024x1024px recommended)
- Gallery images: `/images/gallery/gallery-1.jpg`, `gallery-2.jpg` (1024x1024px)
- Hero image: `/images/hero/hero-1.jpg` (1440x720px recommended)

### Configuration Files

**next.config.ts**:
- `output: "standalone"` for Docker deployment
- TypeScript and ESLint errors ignored during builds (not recommended for production quality)
- React strict mode disabled

**tsconfig.json**:
- Path alias: `@/*` maps to `./src/*`
- `noImplicitAny: false` (allows implicit any types)
- ES2017 target

**components.json** (shadcn/ui):
- Style: "new-york"
- Base color: neutral
- CSS variables enabled
- All components use Lucide icons

### Database (Prisma)

**Schema**: Basic User and Post models (likely scaffolding - not actively used in the application)
- SQLite database
- Database URL from `DATABASE_URL` environment variable
- Prisma client instantiated as singleton in `src/lib/db.ts`

**Note**: The current application doesn't appear to use the database models - all content is hardcoded in the page component.

### Styling System

Global CSS variables defined in `src/app/globals.css`:
- Primary colors: Pink (`--primary`) and black theme
- Uses HSL color system with CSS custom properties
- Dark mode support via `next-themes`
- Tailwind CSS v4 with `@tailwindcss/postcss`

**Utility**: `cn()` function in `src/lib/utils.ts` combines `clsx` and `tailwind-merge` for conditional class names.

### Deployment Notes

**Build Process**:
1. `next build` creates standalone output
2. Build script copies `.next/static` and `public/` into standalone directory
3. Docker container runs `node server.js` from standalone build

**Production Server**:
- Container exposes port 3000
- Host maps port 3003 to container port 3000
- Nginx reverse proxy handles SSL and forwards to localhost:3003
- Domain configured via Certbot for HTTPS

**Important**: The setup-nginx-ssl.sh script automates SSL certificate generation and nginx configuration for the domain.

## Working with This Codebase

### Adding New UI Components
Use shadcn/ui CLI to add components:
```bash
npx shadcn@latest add [component-name]
```
Components will be added to `src/components/ui/` following the project's configuration.

### Modifying Contact Information
All contact links need to be updated manually in `src/app/page.tsx`:
- WhatsApp: Search for `https://wa.me/TU_NUMERO_TELEFONO`
- Phone: Search for `tel:TU_NUMERO_TELEFONO`
- Facebook: Search for `https://facebook.com/TU_PAGINA_FACEBOOK`
- Instagram: Search for `https://instagram.com/TU_PERFIL_INSTAGRAM`

See CONFIGURACION_CONTACTO.md for detailed instructions.

### Working with the Gallery
The gallery array in page.tsx contains objects with:
- `image`: Path to image file
- `title`: Image title for lightbox
- `description`: Detailed description
- `duration`: Service duration (display only)
- `products`: Products used (display only)

To add/modify gallery items, edit the `gallery` array in `src/app/page.tsx`.

### Code Quality Notes
- Build errors for TypeScript and ESLint are currently ignored
- Consider enabling strict type checking for production deployments
- No test suite is currently configured
- The database schema exists but isn't integrated with the frontend
