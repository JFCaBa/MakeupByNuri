'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('gallery');
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

  // Load data when component mounts and when activeTab changes
  useEffect(() => {
    fetchData();
  }, [activeTab, selectedCategory]);

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
          setHeroImage(data.images.length > 0 ? data.images[0]?.url : null);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      showNotification('Error loading data', 'error');
    } finally {
      setLoading(false);
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
        setHeroImage(data.imageUrl);
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
        <div className="flex space-x-4">
          {['gallery', 'hero'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md capitalize ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-accent'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'gallery' ? 'Galería' : tab}
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
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;