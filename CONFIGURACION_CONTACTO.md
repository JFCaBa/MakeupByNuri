# Maquillaje Profesional - Configuración de Contacto

## 📱 Enlaces de Contacto y Redes Sociales

Para configurar los enlaces de contacto y redes sociales, necesitas actualizar las siguientes líneas en el archivo `src/app/page.tsx`:

### 🔗 WhatsApp (Principal - Popup de Reservar Cita)
Busca la línea:
```jsx
<a href="https://wa.me/TU_NUMERO_TELEFONO" target="_blank" rel="noopener noreferrer">
```

Reemplázala con:
```jsx
<a href="https://wa.me/34600123456" target="_blank" rel="noopener noreferrer">
```

### 📞 Teléfono (Popup de Reservar Cita)
Busca la línea:
```jsx
<a href="tel:TU_NUMERO_TELEFONO">
```

Reemplázala con:
```jsx
<a href="tel:+34600123456">
```

### 📘 Facebook (Footer)
Busca la línea:
```jsx
<a href="https://facebook.com/TU_PAGINA_FACEBOOK" target="_blank" rel="noopener noreferrer">
```

Reemplázala con:
```jsx
<a href="https://facebook.com/maquillajepro" target="_blank" rel="noopener noreferrer">
```

### 📷 Instagram (Footer)
Busca la línea:
```jsx
<a href="https://instagram.com/TU_PERFIL_INSTAGRAM" target="_blank" rel="noopener noreferrer">
```

Reemplázala con:
```jsx
<a href="https://instagram.com/maquillaje.pro" target="_blank" rel="noopener noreferrer">
```

## 🎯 Funcionalidades Implementadas

### ✅ Botón "Reservar Cita" (Hero Section)
- **Popup Modal**: Al hacer clic, se abre un diálogo elegante
- **Opción WhatsApp**: Botón verde grande con indicador "Recomendado"
- **Opción Teléfono**: Botón secundario para llamadas directas
- **Descripciones**: Textos explicativos sobre cada opción

### ✅ Botón "Ver Trabajos" (Hero Section)
- **Navegación Suave**: Desplaza automáticamente a la sección de galería
- **Scroll Animado**: Transición suave hacia abajo

### ✅ Enlaces del Footer
- **WhatsApp**: Para consultas rápidas
- **Teléfono**: Para llamadas directas  
- **Facebook**: Para comunidad y fotos
- **Instagram**: Para portfolio visual

## 📝 Ejemplo Completo

Si tu número es +34 600 123 456, tu Facebook es @maquillajepro y tu Instagram es @maquillaje.pro:

```jsx
// WhatsApp (Popup y Footer)
<a href="https://wa.me/34600123456" target="_blank" rel="noopener noreferrer">

// Teléfono (Popup y Footer)  
<a href="tel:+34600123456">

// Facebook (Footer)
<a href="https://facebook.com/maquillajepro" target="_blank" rel="noopener noreferrer">

// Instagram (Footer)
<a href="https://instagram.com/maquillaje.pro" target="_blank" rel="noopener noreferrer">
```

## 🎨 Características del Popup de Reserva

- **Título claro**: "Reservar Cita"
- **Descripción explicativa**: "Elige tu forma preferida de contacto"
- **WhatsApp destacado**: Color verde con badge "Recomendado"
- **Teléfono como alternativa**: Diseño consistente
- **Textos de ayuda**: 
  - 💬 WhatsApp: Envía fotos de referencia
  - 📞 Teléfono: Atención inmediata
- **Diseño responsivo**: Funciona perfecta en móviles y desktop

## 🚀 Ventajas de esta Implementación

✅ **UX mejorada**: Popup elegante sin salir de la página  
✅ **Conversión optimizada**: WhatsApp como principal  
✅ **Navegación fluida**: "Ver Trabajos" con scroll suave  
✅ **Múltiples puntos de contacto**: Hero, popup, footer  
✅ **Diseño consistente**: Todos los botones mantienen la estética  
✅ **Accesibilidad**: Enlaces funcionales y listos para usar  

## 📱 Secciones con IDs

Las secciones ahora tienen IDs para navegación:
- `#gallery` - Galería de trabajos
- `#contact` - Sección de contacto

## 🔧 Notas Técnicas

- Los enlaces se abren en nuevas pestañas (seguridad y UX)
- WhatsApp usa el formato internacional (sin + ni 00)
- El popup usa el componente Dialog de shadcn/ui
- El scroll suave usa JavaScript nativo
- Todos los enlaces son funcionales y listos para usar