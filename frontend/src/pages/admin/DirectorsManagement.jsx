import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import directorsService from "../../services/directorsService";
import { uploadToCloudinary } from "../../services/cloudinary";

const DirectorsManagement = () => {
  const { t } = useTranslation();
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [availableLinks] = useState([
    "linkedin",
    "twitter",
    "facebook",
    "youtube",
    "instagram",
  ]);
  const [activeLinks, setActiveLinks] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    qualification: "",
    occupation: "",
    photo: null,
    status: "Active",
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
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching directors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("photo", formData.photo);
      formDataObj.append("name", formData.name);
      formDataObj.append("position", formData.position);
      formDataObj.append("qualification", formData.qualification);
      formDataObj.append("occupation", formData.occupation);
      formDataObj.append("status", formData.status);

      // For nested objects like socialLinks → stringify
      formDataObj.append("socialLinks", JSON.stringify(formData.socialLinks));

      console.log(formDataObj);

      const directorData = {
        ...formData,
      };

      console.log("Submitting director data:", directorData);

      let savedDirector;
      if (selectedDirector) {
        savedDirector = await directorsService.update(
          selectedDirector.id,
          formDataObj
        );
        setDirectors((prev) =>
          prev.map((d) => (d.id === selectedDirector.id ? savedDirector : d))
        );
      } else {
        savedDirector = await directorsService.create(formDataObj);
        setDirectors((prev) => [...prev, savedDirector]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving director:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (director) => {
    setSelectedDirector(director);

    // Parse socialLinks if it's a string
    let links = {};
    if (director.socialLinks) {
      try {
        links = typeof director.socialLinks === 'string' 
          ? JSON.parse(director.socialLinks) 
          : director.socialLinks;
      } catch (error) {
        console.error('Error parsing social links:', error);
        links = {};
      }
    }
    
    setActiveLinks(Object.keys(links));

    setFormData({
      name: director.name || "",
      position: director.position || "",
      qualification: director.qualification || "",
      occupation: director.occupation || "",
      status: director.status || "Active",
      photo: director.photo || null,
      socialLinks: links,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("admin.common.confirm"))) {
      try {
        await directorsService.delete(id);
        setDirectors((prev) => prev.filter((d) => d.id !== id));
      } catch (error) {
        console.error("Error deleting director:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      qualification: "",
      occupation: "",
      photo: null,
      status: "Active",
      socialLinks: {},
    });
    setSelectedDirector(null);
    setActiveLinks([]);
    setShowModal(false);
  };

  const getSocialIcon = (platform) => {
    const icons = {
      linkedin: "💼",
      twitter: "🐦",
      facebook: "📘",
      youtube: "📺",
      instagram: "📸"
    };
    return icons[platform] || "🔗";
  };

  return (
    <>
      <Helmet>
        <title>{t("admin.common.directors")} | Admin | Apang Seva Kendra</title>
      </Helmet>

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t("admin.common.directors")}
            </h1>
            <p className="text-gray-600">Manage your organization's directors and board members</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-200 flex items-center gap-2 shadow-lg"
          >
            <span className="text-lg">+</span>
            {t("admin.common.add")} Director
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {directors.map((director) => (
              <div key={director.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                {/* Director Photo */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {director.photo ? (
                    <img
                      src={director.photo}
                      alt={director.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-3xl text-gray-500">👤</span>
                      </div>
                    </div>
                  )}
                  {/* Action buttons overlay */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(director)}
                        className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200"
                        title="Edit Director"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(director.id)}
                        className="bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white p-2 rounded-full shadow-lg transition-all duration-200"
                        title="Delete Director"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                {/* Director Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-2">
                      {director.name}
                    </h3>
                    <p className="text-black font-semibold text-sm">
                      {director.position}
                    </p>
                  </div>

                  {/* Qualifications and Occupation */}
                  <div className="space-y-2 mb-4">
                    {director.qualification && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">🎓</span>
                        <span className="text-sm text-gray-600 line-clamp-1">{director.qualification}</span>
                      </div>
                    )}
                    {director.occupation && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">💼</span>
                        <span className="text-sm text-gray-600 line-clamp-1">{director.occupation}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {(() => {
                    // Parse socialLinks if it's a string
                    let socialLinks = {};
                    if (director.socialLinks) {
                      try {
                        socialLinks = typeof director.socialLinks === 'string' 
                          ? JSON.parse(director.socialLinks) 
                          : director.socialLinks;
                      } catch (error) {
                        console.error('Error parsing social links:', error);
                        socialLinks = {};
                      }
                    }

                    return socialLinks && Object.keys(socialLinks).length > 0 && (
                      <div className="border-t pt-4">
                        <p className="text-xs text-gray-500 mb-2">Social Links</p>
                        <div className="space-y-2">
                          {Object.entries(socialLinks).map(([platform, url]) => (
                            url && (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors duration-200 group"
                                title={`Visit ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                              >
                                <span className="text-lg">{getSocialIcon(platform)}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 capitalize">
                                    {platform}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate group-hover:text-gray-700">
                                    {url}
                                  </p>
                                </div>
                                <svg 
                                  className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
            
            {/* Empty State */}
            {directors.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Directors Added Yet</h3>
                <p className="text-gray-500 mb-6">Get started by adding your first director</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-200"
                >
                  Add First Director
                </button>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] relative overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-gray-800 to-black text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedDirector ? "Edit Director" : "Add New Director"}
                    </h2>
                    <p className="text-gray-200 text-sm mt-1">
                      {selectedDirector ? "Update director information" : "Fill in the details to add a new director"}
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="text-white hover:text-gray-300 p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Photo Upload Section */}
                  <div className="text-center">
                    <div className="mb-4">
                      {(formData.photo || directors?.photo) ? (
                        <div className="relative inline-block">
                          <img
                            src={
                              formData.photo instanceof File
                                ? URL.createObjectURL(formData.photo)
                                : formData.photo || directors?.photo
                            }
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-full border-4 border-gray-200 shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, photo: null }))
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="h-32 w-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                          <span className="text-4xl text-gray-400">👤</span>
                        </div>
                      )}
                    </div>
                    
                    <label className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200">
                      <span>📷</span>
                      Upload Photo
                      <input
                        type="file"
                        name="photo"
                        onChange={handleInputChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Position *
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Managing Director"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Qualification
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        placeholder="e.g., MBA, PhD"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Occupation
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        placeholder="Current occupation"
                      />
                    </div>
                  </div>

                  {/* Social Links Section */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Links</h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Social Platform
                      </label>
                      <select
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value && !activeLinks.includes(value)) {
                            setActiveLinks((prev) => [...prev, value]);
                          }
                          e.target.value = "";
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="">-- Select Platform --</option>
                        {availableLinks
                          .filter((link) => !activeLinks.includes(link))
                          .map((link) => (
                            <option key={link} value={link}>
                              {getSocialIcon(link)} {link.charAt(0).toUpperCase() + link.slice(1)}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      {activeLinks.map((link) => (
                        <div key={link} className="bg-white rounded-lg p-4 border">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {getSocialIcon(link)} {link.charAt(0).toUpperCase() + link.slice(1)} URL
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              name={`socialLinks.${link}`}
                              value={formData.socialLinks?.[link] || ""}
                              onChange={handleInputChange}
                              placeholder={`https://${link}.com/username`}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setActiveLinks((prev) =>
                                  prev.filter((l) => l !== link)
                                );
                                setFormData((prev) => {
                                  const updated = { ...prev.socialLinks };
                                  delete updated[link];
                                  return { ...prev, socialLinks: updated };
                                });
                              }}
                              className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}
                      disabled={loading}
                      className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                    >
                      {loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      )}
                      {loading ? "Saving..." : selectedDirector ? "Update Director" : "Add Director"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DirectorsManagement;