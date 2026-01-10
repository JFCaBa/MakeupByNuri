'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import StarRating from '@/components/StarRating';

interface TestimonialSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TestimonialSubmissionModal({
  isOpen,
  onClose,
  onSuccess
}: TestimonialSubmissionModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    text: '',
    rating: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.text.trim()) {
      newErrors.text = 'El texto de la reseña es obligatorio';
    } else if (formData.text.trim().length < 10) {
      newErrors.text = 'La reseña debe tener al menos 10 caracteres';
    } else if (formData.text.trim().length > 75) {
      newErrors.text = 'La reseña no puede exceder 75 caracteres';
    }

    if (formData.rating === 0) {
      newErrors.rating = 'Por favor, selecciona una valoración';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - show notification and close modal
        onSuccess();
        onClose();
        // Reset form
        setFormData({ email: '', name: '', text: '', rating: 0 });
        setErrors({});
      } else {
        setErrors({ submit: data.error || 'Error al enviar la reseña' });
      }
    } catch (error) {
      setErrors({ submit: 'Error de conexión. Por favor, inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', name: '', text: '', rating: 0 });
    setErrors({});
    onClose();
  };

  const remainingChars = 75 - formData.text.length;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Añade tu reseña</DialogTitle>
          <DialogDescription>
            Comparte tu experiencia con nosotros. Tu opinión es muy importante.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="tu@email.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Tu nombre"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Valoración *</Label>
            <div className="flex items-center gap-2">
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating) => setFormData({ ...formData, rating })}
              />
              {formData.rating > 0 && (
                <span className="text-sm text-muted-foreground">
                  {formData.rating} {formData.rating === 1 ? 'estrella' : 'estrellas'}
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="text">Tu reseña *</Label>
              <span className={`text-xs ${remainingChars < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {remainingChars} caracteres restantes
              </span>
            </div>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Cuéntanos tu experiencia..."
              rows={4}
              aria-invalid={!!errors.text}
              maxLength={75}
            />
            {errors.text && (
              <p className="text-sm text-destructive">{errors.text}</p>
            )}
          </div>

          {errors.submit && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            ** La reseña será publicada una vez verificada
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
