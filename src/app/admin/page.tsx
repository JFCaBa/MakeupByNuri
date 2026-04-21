'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('gallery');
  const [serviceContents, setServiceContents] = useState<any[]>([]);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Maquillaje de día');
  const [categories, setCategories] = useState([
    'Maquillaje de día',
    'Maquillaje de noche',
    'Novia',
    'Invitadas',
    'Fallera',
    'Maquillaje artístico'
  ]);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  
  // Backup management state
  const [backupLoading, setBackupLoading] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);
  const [backupMessage, setBackupMessage] = useState('');

  // Load data when component mounts and when activeTab changes
  useEffect(() => {
    fetchData();
    if (activeTab === 'backup') {
      loadBackups();
    }
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'gallery') {
        // Fetch images for the selected category
        const res = await fetch(`/api/admin/images?category=${encodeURIComponent(selectedCategory)}`);
        if (res.ok) {
          const data = await res.json();
          setImages(data.images || []);
        }
      } else if (activeTab === 'hero') {
        // Fetch hero image
        const res = await fetch('/api/admin/images?type=hero');
        if (res.ok) {
          const data = await res.json();
          const heroUrl = data.images.length > 0 ? data.images[0]?.url : null;
          // Add cache-busting parameter to ensure we always get the latest
          setHeroImage(heroUrl ? `${heroUrl}?t=${Date.now()}` : null);
        }
      } else if (activeTab === 'texts') {
        // Fetch service content
        const res = await fetch('/api/admin/service-content');
        if (res.ok) {
          const data = await res.json();
          setServiceContents(data.serviceContents || []);
        }
      } else if (activeTab === 'testimonials') {
        // Fetch testimonials
        const res = await fetch('/api/admin/testimonials');
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data.testimonials || []);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      showNotification('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadBackups = async () => {
    setBackupLoading(true);
    try {
      const res = await fetch('/api/admin/backup?action=list');
      if (res.ok) {
        const data = await res.json();
        setBackups(data.backups || []);
      } else {
        const error = await res.json();
        showNotification(error.error || 'Error loading backups', 'error');
      }
    } catch (error) {
      console.error('Error loading backups:', error);
      showNotification('Error loading backups', 'error');
    } finally {
      setBackupLoading(false);
    }
  };

  const createBackup = async () => {
    setBackupLoading(true);
    setBackupMessage('Creating backup...');
    try {
      const res = await fetch('/api/admin/backup?action=create');
      const data = await res.json();
      
      if (res.ok && data.success) {
        showNotification(data.message || 'Backup created successfully', 'success');
        // Reload backups
        await loadBackups();
      } else {
        showNotification(data.error || 'Failed to create backup', 'error');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      showNotification('Error creating backup', 'error');
    } finally {
      setBackupLoading(false);
      setBackupMessage('');
    }
  };

  const restoreBackup = async (backupName: string) => {
    if (!confirm(`Are you sure you want to restore from backup: ${backupName}? This will overwrite the current database.`)) {
      return;
    }

    setBackupLoading(true);
    setBackupMessage(`Restoring from ${backupName}...`);
    try {
      const res = await fetch(`/api/admin/backup?action=restore&file=${encodeURIComponent(backupName)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        showNotification(data.message || 'Database restored successfully', 'success');
      } else {
        showNotification(data.error || 'Failed to restore backup', 'error');
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      showNotification('Error restoring backup', 'error');
    } finally {
      setBackupLoading(false);
      setBackupMessage('');
    }
  };

  const deleteBackup = async (backupName: string) => {
    if (!confirm(`Are you sure you want to delete the backup: ${backupName}? This action cannot be undone.`)) {
      return;
    }

    setBackupLoading(true);
    setBackupMessage(`Deleting backup ${backupName}...`);
    try {
      const res = await fetch(`/api/admin/backup?file=${encodeURIComponent(backupName)}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showNotification(data.message || 'Backup deleted successfully', 'success');
        // Reload backups
        await loadBackups();
      } else {
        showNotification(data.error || 'Failed to delete backup', 'error');
      }
    } catch (error) {
      console.error('Error deleting backup:', error);
      showNotification('Error deleting backup', 'error');
    } finally {
      setBackupLoading(false);
      setBackupMessage('');
    }
  };

  const restoreImageBackup = async (backupName: string) => {
    if (!confirm(`Are you sure you want to restore images from backup: ${backupName}? This will overwrite current images.`)) {
      return;
    }

    setBackupLoading(true);
    setBackupMessage(`Restoring images from ${backupName}...`);
    try {
      // Since image restore is more complex, we'll trigger it via the same endpoint
      // with a different action parameter
      const res = await fetch(`/api/admin/backup?action=restore-images&file=${encodeURIComponent(backupName)}`, {
        method: 'POST'
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showNotification(data.message || 'Images restored successfully', 'success');
      } else {
        showNotification(data.error || 'Failed to restore images', 'error');
      }
    } catch (error) {
      console.error('Error restoring images:', error);
      showNotification('Error restoring images', 'error');
    } finally {
      setBackupLoading(false);
      setBackupMessage('');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 seconds
  };

  const handleLogout = () => {
    // Clear any stored credentials and redirect to login
    localStorage.removeItem('adminCredentials');
    router.push('/admin/login');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', selectedCategory);

    try {
      const res = await fetch('/api/admin/images', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        showNotification('Image uploaded successfully', 'success');

        // Refresh the images list
        fetchData();
      } else {
        const error = await res.json();
        showNotification(error.error || 'Failed to upload image', 'error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('Error uploading image', 'error');
    }
  };

  const handleImageDelete = async (fileName: string, category: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/images?fileName=${encodeURIComponent(fileName)}&category=${encodeURIComponent(category)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showNotification('Imagen eliminada correctamente', 'success');

        // Refresh the images list
        fetchData();
      } else {
        const error = await res.json();
        showNotification(error.error || 'Error al eliminar la imagen', 'error');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      showNotification('Error al eliminar la imagen', 'error');
    }
  };

  const handleHeroImageSave = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'hero');

    try {
      const res = await fetch('/api/admin/images', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        showNotification('Hero image updated successfully', 'success');
        // Add cache-busting parameter to force browser to fetch new image
        setHeroImage(`${data.imageUrl}?t=${Date.now()}`);
      } else {
        const error = await res.json();
        showNotification(error.error || 'Failed to update hero image', 'error');
      }
    } catch (error) {
      console.error('Error updating hero image:', error);
      showNotification('Error updating hero image', 'error');
    }
  };

  const handleHeroImageRemove = async () => {
    if (!heroImage) return;

    // Extract filename from URL
    const fileName = heroImage.split('/').pop();
    if (!fileName) return;

    if (!confirm('Are you sure you want to remove this hero image?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/images?fileName=${encodeURIComponent(fileName)}&type=hero`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showNotification('Hero image removed successfully', 'success');
        setHeroImage(null);
      } else {
        const error = await res.json();
        showNotification(error.error || 'Failed to remove hero image', 'error');
      }
    } catch (error) {
      console.error('Error removing hero image:', error);
      showNotification('Error removing hero image', 'error');
    }
  };

  const handleSaveServiceContent = async () => {
    if (!editingContent) return;

    try {
      const res = await fetch('/api/admin/service-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingContent),
      });

      if (res.ok) {
        const data = await res.json();
        showNotification('Contenido actualizado correctamente', 'success');

        // Update the local state
        setServiceContents(prev =>
          prev.map(content =>
            content.id === data.serviceContent.id ? data.serviceContent : content
          )
        );

        // Close the modal
        setIsEditing(false);
        setEditingContent(null);
      } else {
        const error = await res.json();
        showNotification(error.error || 'Error al guardar el contenido', 'error');
      }
    } catch (error) {
      console.error('Error saving service content:', error);
      showNotification('Error al guardar el contenido', 'error');
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        const data = await res.json();
        showNotification(data.message, 'success');

        // Update local state
        setTestimonials(prev =>
          prev.map(t =>
            t.id === id ? { ...t, published: !t.published } : t
          )
        );
      } else {
        const error = await res.json();
        showNotification(error.error || 'Error al actualizar la reseña', 'error');
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
      showNotification('Error al actualizar la reseña', 'error');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/testimonials?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showNotification('Reseña eliminada correctamente', 'success');

        // Remove from local state
        setTestimonials(prev => prev.filter(t => t.id !== id));
      } else {
        const error = await res.json();
        showNotification(error.error || 'Error al eliminar la reseña', 'error');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      showNotification('Error al eliminar la reseña', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard - MakeupByNuri</h1>
        <button
          onClick={handleLogout}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-md transition-colors"
        >
          Logout
        </button>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-border bg-muted/30 p-4">
        <div className="flex space-x-4 overflow-x-auto">
          {['gallery', 'hero', 'texts', 'testimonials', 'backup'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-accent'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'gallery' ? 'Galería' : 
               tab === 'texts' ? 'Textos' : 
               tab === 'testimonials' ? 'Reseñas' : 
               tab === 'backup' ? 'Backup' : tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {activeTab === 'gallery' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-semibold">Galería de Imágenes</h2>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <label className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors">
                      Subir Imagen
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {images.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No hay imágenes para esta categoría</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((image, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-medium truncate">{image.name}</h3>
                          <div className="mt-3 flex space-x-2">
                            <button
                              className="text-destructive hover:underline text-sm"
                              onClick={() => handleImageDelete(image.name, selectedCategory)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'hero' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold">Imagen de Portada</h2>

                <div className="border rounded-lg p-6 max-w-2xl">
                  {heroImage ? (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Imagen Actual</h3>
                      <img
                        src={heroImage}
                        alt="Imagen de Portada Actual"
                        className="w-full h-64 object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground mb-6">No hay imagen de portada establecida</p>
                  )}

                  <div className="space-y-4">
                    <label className="block">
                      <span className="block mb-2 font-medium">Nueva Imagen de Portada</span>
                      <input
                        type="file"
                        className="block w-full"
                        accept="image/*"
                        onChange={handleHeroImageSave}
                      />
                    </label>

                    <div className="flex space-x-3">
                      {heroImage && (
                        <button
                          className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90 transition-colors"
                          onClick={handleHeroImageRemove}
                        >
                          Eliminar Imagen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'texts' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Gestión de Textos</h2>
                </div>

                {serviceContents.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No hay contenido de servicios para gestionar</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Servicio</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Descripción de la tarjeta</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Descripción detallada</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-background divide-y divide-gray-200">
                        {serviceContents.map((content) => (
                          <tr key={content.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium">{content.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">{content.description}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm max-w-md truncate">{content.detailedDescription || "No definido"}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                className="text-primary hover:underline mr-4"
                                onClick={() => {
                                  setEditingContent(content);
                                  setIsEditing(true);
                                }}
                              >
                                Editar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Edit Modal */}
                {isEditing && editingContent && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-background rounded-md p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <h3 className="text-lg font-semibold mb-4">Editar contenido de {editingContent.title}</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Descripción de la tarjeta</label>
                          <textarea
                            value={editingContent.description}
                            onChange={(e) => setEditingContent({...editingContent, description: e.target.value})}
                            className="w-full p-2 border rounded-md min-h-[100px]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Descripción detallada (opcional)</label>
                          <textarea
                            value={editingContent.detailedDescription || ''}
                            onChange={(e) => setEditingContent({...editingContent, detailedDescription: e.target.value})}
                            className="w-full p-2 border rounded-md min-h-[150px]"
                            placeholder="Deja en blanco si no quieres usar descripción detallada"
                          />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                            className="px-4 py-2 border rounded-md hover:bg-muted"
                            onClick={() => {
                              setIsEditing(false);
                              setEditingContent(null);
                            }}
                          >
                            Cancelar
                          </button>
                          <button
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                            onClick={handleSaveServiceContent}
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'testimonials' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Gestión de Reseñas</h2>
                  <div className="text-sm text-muted-foreground">
                    {testimonials.filter(t => !t.published).length} pendientes de publicar
                  </div>
                </div>

                {testimonials.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No hay reseñas todavía</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Valoración</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Reseña</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fecha</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-background divide-y divide-gray-200">
                        {testimonials.map((testimonial) => (
                          <tr
                            key={testimonial.id}
                            className={!testimonial.published ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium">{testimonial.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-muted-foreground">{testimonial.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm max-w-md">{testimonial.text}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                testimonial.published
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              }`}>
                                {testimonial.published ? 'Publicada' : 'Pendiente'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                              {new Date(testimonial.createdAt).toLocaleDateString('es-ES')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                className="text-primary hover:underline mr-4"
                                onClick={() => handleTogglePublish(testimonial.id)}
                              >
                                {testimonial.published ? 'Ocultar' : 'Publicar'}
                              </button>
                              <button
                                className="text-destructive hover:underline"
                                onClick={() => handleDeleteTestimonial(testimonial.id)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'backup' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Gestión de Backups</h2>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg">
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <button
                      className={`flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-md hover:bg-primary/90 transition-colors ${
                        backupLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={createBackup}
                      disabled={backupLoading}
                    >
                      {backupLoading && backupMessage.includes('Creating') ? 'Creando...' : 'Crear Nuevo Backup'}
                    </button>
                  </div>

                  {backupMessage && (
                    <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
                      {backupMessage}
                    </div>
                  )}

                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-3 font-medium">Lista de Backups</div>
                    {backupLoading && activeTab === 'backup' ? (
                      <div className="p-8 text-center">
                        <div className="animate-spin mx-auto h-8 w-8 border-t-2 border-b-2 border-primary rounded-full mb-2"></div>
                        <p>Cargando backups...</p>
                      </div>
                    ) : backups.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        No se encontraron backups. Crea uno nuevo para empezar.
                      </div>
                    ) : (
                      <div className="divide-y">
                        {backups.map((backup, index) => (
                          <div key={index} className="p-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{backup.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(backup.createdAt).toLocaleString()} •{' '}
                                {(backup.size / 1024).toFixed(2)} KB •{' '}
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  backup.type === 'database'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {backup.type === 'database' ? 'Base de datos' : 'Imágenes'}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <a
                                href={`/api/admin/backup?action=download&file=${encodeURIComponent(backup.name)}`}
                                download={backup.name}
                                className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
                              >
                                Descargar
                              </a>
                              {backup.type === 'database' && (
                                <button
                                  className="px-3 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 text-sm"
                                  onClick={() => restoreBackup(backup.name)}
                                  disabled={backupLoading}
                                >
                                  Restaurar
                                </button>
                              )}
                              {backup.type === 'images' && (
                                <button
                                  className="px-3 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 text-sm"
                                  onClick={() => restoreImageBackup(backup.name)}
                                  disabled={backupLoading}
                                >
                                  Restaurar
                                </button>
                              )}
                              <button
                                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 text-sm"
                                onClick={() => deleteBackup(backup.name)}
                                disabled={backupLoading}
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h3 className="font-medium text-yellow-800 mb-2">Importante:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-yellow-700 text-sm">
                      <li>Los backups se almacenan en el servidor en formato binario SQLite</li>
                      <li>La restauración de un backup sobrescribirá la base de datos actual</li>
                      <li>Se crea automáticamente un backup de seguridad antes de cada restauración</li>
                      <li>Después de la restauración, es posible que necesite recargar la página</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;