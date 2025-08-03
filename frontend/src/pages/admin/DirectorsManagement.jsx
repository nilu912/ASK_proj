import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import directorsService from '../../services/directorsService';
import { uploadToCloudinary } from '../../services/cloudinary';

const DirectorsManagement = () => {
  const { t } = useTranslation();
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [availableLinks] = useState(['linkedin', 'twitter', 'facebook', 'youtube', 'instagram']);
  const [activeLinks, setActiveLinks] = useState([]);  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    qualification: '',
    occupation: '',
    photo: null,
    status: 'Active',
      socialLinks: {},

  });

  // Fetch directors on component mount
  useEffect(() => {
    fetchDirectors();
  }, []);

  const fetchDirectors = async () => {
    try {
      setLoading(true);
      const response = await directorsService.getAll();
      setDirectors(response.data || []);
    } catch (error) {
      console.error('Error fetching directors:', error);
      // Fallback to mock data if API fails
      setDirectors([
        {
          id: 1,
          name: 'Dr. Rajesh Kumar',
          position: 'Chairman',
          email: 'rajesh@example.com',
          phone: '+91 9876543210',
          qualification: 'Ph.D. in Social Work',
          occupation: 'Professor',
          status: 'Active',
          photo: '/placeholder-person.jpg'
        },
        {
          id: 2,
          name: 'Mrs. Priya Sharma',
          position: 'Secretary',
          email: 'priya@example.com',
          phone: '+91 9876543211',
          qualification: 'M.S. in Healthcare Administration',
          occupation: 'Healthcare Executive',
          status: 'Active',
          photo: '/placeholder-person.jpg'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name.startsWith('socialLinks.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [key]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      let photoUrl = formData.photo;
      if (formData.photo instanceof File) {
        const uploadResult = await uploadToCloudinary(formData.photo);
        photoUrl = uploadResult.secure_url;
      }

      const directorData = {
        ...formData,
        photo: photoUrl
      };

      let savedDirector;
      if (selectedDirector) {
        savedDirector = await directorsService.update(selectedDirector.id, directorData);
        setDirectors(prev => prev.map(d => d.id === selectedDirector.id ? savedDirector : d));
      } else {
        savedDirector = await directorsService.create(directorData);
        setDirectors(prev => [...prev, savedDirector]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving director:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (director) => {
    setSelectedDirector(director);
  
    const links = director.socialLinks || {};
    setActiveLinks(Object.keys(links));
  
    setFormData({
      name: director.name || '',
      position: director.position || '',
      qualification: director.qualification || '',
      occupation: director.occupation || '',
      status: director.status || 'Active',
      photo: director.photo || null,
      socialLinks: links
    });
  
    setShowModal(true);
  };
  

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.common.confirm'))) {
      try {
        await directorsService.delete(id);
        setDirectors(prev => prev.filter(d => d.id !== id));
      } catch (error) {
        console.error('Error deleting director:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      qualification: '',
      occupation: '',
      photo: null,
      status: 'Active',
      socialLinks: {},
    });
    setSelectedDirector(null);
    setActiveLinks([]);
    setShowModal(false);
  };
  

  return (
    <>
      <Helmet>
        <title>{t('admin.common.directors')} | Admin | Apang Seva Kendra</title>
      </Helmet>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t('admin.common.directors')}
          </h1>
          <button 
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 bg-black text-white px-4 py-2 rounded-md hover:bg-accent-dark transition duration-150"
          >
            {t('admin.common.add')} Director
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {directors.map((director) => (
                    <tr key={director.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{director.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{director.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{director.email}</div>
                        <div className="text-sm text-gray-500">{director.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {director.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(director)}
                          className="text-accent hover:text-accent-dark mr-3"
                        >
                          {t('admin.common.edit')}
                        </button>
                        <button 
                          onClick={() => handleDelete(director.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {t('admin.common.delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold mb-4">
                {selectedDirector ? t('admin.common.edit') : t('admin.common.add')} Director
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Add Social Link
  </label>
  <select
    onChange={(e) => {
      const value = e.target.value;
      if (value && !activeLinks.includes(value)) {
        setActiveLinks((prev) => [...prev, value]);
      }
      e.target.value = '';
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-md"
  >
    <option value="">-- Select --</option>
    {availableLinks
      .filter(link => !activeLinks.includes(link))
      .map(link => (
        <option key={link} value={link}>
          {link.charAt(0).toUpperCase() + link.slice(1)}
        </option>
      ))}
  </select>
  {activeLinks.map((link) => (
  <div key={link} className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {link.charAt(0).toUpperCase() + link.slice(1)} URL
    </label>
    <div className="flex space-x-2">
      <input
        type="url"
        name={`socialLinks.${link}`}
        value={formData.socialLinks?.[link] || ''}
        onChange={handleInputChange}
        placeholder={`https://${link}.com/username`}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <button
        type="button"
        onClick={() => {
          setActiveLinks(prev => prev.filter(l => l !== link));
          setFormData(prev => {
            const updated = { ...prev.socialLinks };
            delete updated[link];
            return { ...prev, socialLinks: updated };
          });
        }}
        className="px-2 text-sm text-red-500 hover:underline"
      >
        Remove
      </button>
    </div>
  </div>
))}

</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo
                  </label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-black text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {t('admin.common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-accent bg-black text-white rounded-md hover:bg-accent-dark disabled:opacity-50"
                  >
                    {loading ? t('admin.common.loading') : t('admin.common.save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DirectorsManagement;
