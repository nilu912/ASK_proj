import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import eventsService from "../../services/eventsService";
import axios from "axios";

const EventCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    registrationDeadline: "",
    image: null,
    status: "Upcoming",
    maxParticipants: "",
    registrationFields: [
      { id: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
      { id: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'Enter your email' },
      { id: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: 'Enter your phone number' }
    ]
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    try {
      const data = new FormData();
  
      // Extract date and time from startDate input
      const [endDateOnly, startTimeOnly] = formData.endDate.split("T"); // e.g. ["2025-08-10", "14:30"]
  
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("startDate", formData.startDate);         // e.g. 2025-08-10
      data.append("startTime", startTimeOnly);         // e.g. 14:30
      data.append("endDate", endDateOnly);        // e.g. 2025-08-12
      data.append("location", formData.location);
      data.append("registrationDeadline", formData.registrationDeadline);
      data.append("status", formData.status);
      formData.registrationFields.forEach((field, index) => {
        data.append(`registrationFields[${index}]`, JSON.stringify(field));
      });
            if (formData.maxParticipants) data.append("maxParticipants", formData.maxParticipants);
  
      if (formData.image) data.append("image", formData.image);
  
      console.log(JSON.stringify(formData.registrationFields, null, 2));
      console.log(data)
      await eventsService.create(data);
  
      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        registrationDeadline: "",
        image: null,
        status: "Upcoming",
      });
      setImagePreview(null);
    } catch (err) {
      console.error("Error creating event:", err);
      setError("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
      navigate("/admin/events/");
    }
  };
  

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  // Form field management functions
  const addFormField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: []
    };
    setFormData(prev => ({
      ...prev,
      registrationFields: [...prev.registrationFields, newField]
    }));
  };

  const updateFormField = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      registrationFields: prev.registrationFields.map((f, i) => 
        i === index ? { ...f, [field]: value } : f
      )
    }));
  };

  const removeFormField = (index) => {
    setFormData(prev => ({
      ...prev,
      registrationFields: prev.registrationFields.filter((_, i) => i !== index)
    }));
  };

  const addSelectOption = (fieldIndex) => {
    setFormData(prev => ({
      ...prev,
      registrationFields: prev.registrationFields.map((f, i) => 
        i === fieldIndex ? { ...f, options: [...(f.options || []), ''] } : f
      )
    }));
  };

  const updateSelectOption = (fieldIndex, optionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      registrationFields: prev.registrationFields.map((f, i) => 
        i === fieldIndex ? {
          ...f, 
          options: f.options.map((opt, oi) => oi === optionIndex ? value : opt)
        } : f
      )
    }));
  };

  const removeSelectOption = (fieldIndex, optionIndex) => {
    setFormData(prev => ({
      ...prev,
      registrationFields: prev.registrationFields.map((f, i) => 
        i === fieldIndex ? {
          ...f, 
          options: f.options.filter((_, oi) => oi !== optionIndex)
        } : f
      )
    }));
  };

  return (
    <>
      <Helmet>
        <title>
          {t("admin.dashboard.createEvent")} | Admin | Apang Seva Kendra
        </title>
      </Helmet>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t("admin.dashboard.createEvent")}
          </h1>
          <button
            onClick={() => navigate("/admin/events")}
            className="mt-4 md:mt-0 text-gray-600 hover:text-gray-800 transition duration-150"
          >
            ← Back to Events
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            Event created successfully! Redirecting to events list...
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter event title"
              />
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter event description"
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter event location"
              />
            </div>

            {/* Capacity and Registration Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Deadline
                </label>
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="..."
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Dynamic Registration Form Builder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Registration Form Fields
              </label>
              <div className="space-y-4 border rounded-lg p-4">
                {formData.registrationFields.map((field, index) => (
                  <div key={index} className="border rounded p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field Label *
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateFormField(index, 'label', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="Enter field label"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field Type *
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) => updateFormField(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="tel">Phone</option>
                          <option value="number">Number</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select Dropdown</option>
                          <option value="radio">Radio Buttons</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Placeholder Text
                        </label>
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => updateFormField(index, 'placeholder', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="Enter placeholder text"
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateFormField(index, 'required', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700">Required Field</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeFormField(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove Field
                        </button>
                      </div>
                    </div>

                    {/* Options for select/radio fields */}
                    {(field.type === 'select' || field.type === 'radio') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Options
                        </label>
                        <div className="space-y-2">
                          {(field.options || []).map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateSelectOption(index, optionIndex, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => removeSelectOption(index, optionIndex)}
                                className="text-red-600 hover:text-red-800"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addSelectOption(index)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            + Add Option
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addFormField}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-accent hover:text-accent transition-colors"
                >
                  + Add Form Field
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-accent transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-48 object-cover rounded-lg"
                    />
                    <div className="flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload an image
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </label>
                      <input
                        id="image-upload"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/events")}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-150"
              >
                {t("admin.common.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  t("admin.common.create")
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EventCreate;
