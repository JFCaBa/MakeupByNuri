'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('gallery');
  const [images, setImages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Load data when component mounts and when activeTab changes
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'gallery' || activeTab === 'carousel' || activeTab === 'hero') {
        // Fetch images based on current tab
        const type = activeTab;
        const res = await fetch(`/api/admin/images?type=${type}`);
        if (res.ok) {
          const data = await res.json();
          if (activeTab === 'hero') {
            setHeroImage(data.images.length > 0 ? data.images[0]?.url : null);
          } else {
            setImages(data.images || []);
          }
        }
      } else if (activeTab === 'categories') {
        // Fetch categories
        const res = await fetch('/api/admin/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string, category?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    if (category) formData.append('category', category);

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

  const handleImageDelete = async (fileName: string, type: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/images?fileName=${encodeURIComponent(fileName)}&type=${type}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showNotification('Image deleted successfully', 'success');

        // Refresh the images list
        fetchData();
      } else {
        const error = await res.json();
        showNotification(error.error || 'Failed to delete image', 'error');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      showNotification('Error deleting image', 'error');
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
          {['gallery', 'categories', 'hero', 'carousel'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md capitalize ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-accent'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
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
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Gallery Images</h2>
                  <label className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors">
                    Upload New Image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'gallery')}
                    />
                  </label>
                </div>

                {images.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No gallery images found</p>
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
                              onClick={() => handleImageDelete(image.name, 'gallery')}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Categories</h2>
                  <button
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    onClick={async () => {
                      const newName = prompt('Enter new category name:');
                      if (newName) {
                        try {
                          const res = await fetch('/api/admin/categories', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name: newName }),
                          });

                          if (res.ok) {
                            const data = await res.json();
                            showNotification('Category added successfully', 'success');
                            fetchData(); // Refresh the list
                          } else {
                            const error = await res.json();
                            showNotification(error.error || 'Failed to add category', 'error');
                          }
                        } catch (error) {
                          console.error('Error adding category:', error);
                          showNotification('Error adding category', 'error');
                        }
                      }
                    }}
                  >
                    Add Category
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-3 text-left">Name</th>
                        <th className="border p-3 text-left">Image Count</th>
                        <th className="border p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td className="border p-3">{category.name}</td>
                          <td className="border p-3">{category.imageCount || 0}</td>
                          <td className="border p-3">
                            <button
                              className="text-destructive hover:underline mr-3"
                              onClick={async () => {
                                if (confirm('Are you sure you want to delete this category?')) {
                                  try {
                                    const res = await fetch(`/api/admin/categories?id=${category.id}`, {
                                      method: 'DELETE',
                                    });

                                    if (res.ok) {
                                      showNotification('Category deleted successfully', 'success');
                                      fetchData(); // Refresh the list
                                    } else {
                                      const error = await res.json();
                                      showNotification(error.error || 'Failed to delete category', 'error');
                                    }
                                  } catch (error) {
                                    console.error('Error deleting category:', error);
                                    showNotification('Error deleting category', 'error');
                                  }
                                }
                              }}
                            >
                              Delete
                            </button>
                            <button
                              className="text-blue-500 hover:underline"
                              onClick={async () => {
                                const newName = prompt('Enter new category name:', category.name);
                                if (newName && newName !== category.name) {
                                  try {
                                    const res = await fetch('/api/admin/categories', {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ id: category.id, name: newName }),
                                    });

                                    if (res.ok) {
                                      const data = await res.json();
                                      showNotification('Category updated successfully', 'success');
                                      fetchData(); // Refresh the list
                                    } else {
                                      const error = await res.json();
                                      showNotification(error.error || 'Failed to update category', 'error');
                                    }
                                  } catch (error) {
                                    console.error('Error updating category:', error);
                                    showNotification('Error updating category', 'error');
                                  }
                                }
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'hero' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold">Hero Section</h2>

                <div className="border rounded-lg p-6 max-w-2xl">
                  {heroImage ? (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Current Hero Image</h3>
                      <img
                        src={heroImage}
                        alt="Current Hero"
                        className="w-full h-64 object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground mb-6">No hero image set</p>
                  )}

                  <div className="space-y-4">
                    <label className="block">
                      <span className="block mb-2 font-medium">New Hero Image</span>
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
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'carousel' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Carousel Images</h2>
                  <label className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors">
                    Add Carousel Image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'carousel')}
                    />
                  </label>
                </div>

                {images.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No carousel images found</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {images.map((image, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                        <img
                          src={image.url}
                          alt={`Carousel ${index}`}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground truncate">{image.name}</span>
                            <button
                              className="text-destructive hover:underline text-sm"
                              onClick={() => handleImageDelete(image.name, 'carousel')}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;