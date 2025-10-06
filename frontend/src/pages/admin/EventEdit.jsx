import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import eventsService from "../../services/eventsService";

const EventEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [updateImg, setUpdateImg] = useState(false);
  const [oldImg, setOldImg] = useState();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    address: "",
    registrationDeadline: "",
    image: null,
    status: "Upcoming",
    maxParticipants: "",
    registrationRequired: true,
    registrationFields: [],
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const statusOptions = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const response = await eventsService.getById(eventId);
        const { startDate, endDate, images, registrationDeadline, registrationFields, ...AllData } =
          response.data;
        
        const formatedStartDate = new Date(startDate).toISOString().split("T")[0];
        const formatedEndDate = new Date(endDate).toISOString().split("T")[0];
        const formatedRegDeadline = registrationDeadline 
          ? new Date(registrationDeadline).toISOString().split("T")[0]
          : "";
        const imgUrl = images[0]?.url || "";

        setImagePreview(imgUrl);
        setOldImg(imgUrl);
        
        // Parse registration fields - handle both string and object formats
        let parsedFields = [];
        if (registrationFields && Array.isArray(registrationFields)) {
          parsedFields = registrationFields.map(field => {
            // If field is a string, parse it
            if (typeof field === 'string') {
              try {
                return JSON.parse(field);
              } catch (e) {
                console.error("Error parsing field:", e);
                return null;
              }
            }
            // If it's already an object, use it directly
            return field;
          }).filter(Boolean); // Remove any null values
        }

        const updatedFormData = {
          ...AllData,
          startDate: formatedStartDate,
          endDate: formatedEndDate,
          registrationDeadline: formatedRegDeadline,
          registrationFields: parsedFields.length > 0 ? parsedFields : [
            {
              id: "name",
              label: "Full Name",
              type: "text",
              required: true,
              placeholder: "Enter your full name",
            },
            {
              id: "email",
              label: "Email Address",
              type: "email",
              required: true,
              placeholder: "Enter your email",
            },
            {
              id: "phone",
              label: "Phone Number",
              type: "tel",
              required: true,
              placeholder: "Enter your phone number",
            },
          ],
        };
        
        setFormData(updatedFormData);
      } catch (err) {
        console.error("Error fetching event data:", err);
        setError("Failed to load event data");
      }
    };
    
    if (eventId) {
      fetchEventsData();
    }
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (name === "image" && files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";

    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      if (startDate < today) {
        newErrors.startDate = "Start date cannot be in the past";
      }
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (formData.registrationDeadline && formData.endDate) {
      const regDeadline = new Date(formData.registrationDeadline);
      const endDate = new Date(formData.endDate);
      if (regDeadline > endDate) {
        newErrors.registrationDeadline =
          "Registration deadline must be before end date";
      }
    }

    if (formData.registrationDeadline) {
      const regDeadline = new Date(formData.registrationDeadline);
      if (regDeadline < today) {
        newErrors.registrationDeadline =
          "Registration deadline cannot be in the past";
      }
    }

    if (
      formData.maxParticipants &&
      (isNaN(formData.maxParticipants) || formData.maxParticipants <= 0)
    ) {
      newErrors.maxParticipants = "Max participants must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateImgEventHandler = () => {
    if (updateImg) {
      setImagePreview(oldImg);
      setFormData(prev => ({ ...prev, image: null }));
    }
    setUpdateImg(!updateImg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("startTime", formData.startTime);
      data.append("address", formData.address);
      data.append("status", formData.status);

      if (formData.registrationDeadline) {
        data.append("registrationDeadline", formData.registrationDeadline);
      }

      if (formData.maxParticipants) {
        data.append("maxParticipants", formData.maxParticipants);
      }

      formData.registrationFields.forEach((field, index) => {
        data.append(`registrationFields[${index}]`, JSON.stringify(field));
      });

      if (formData.image && updateImg) {
        data.append("image", formData.image);
      }

      console.log("FormData being sent:", Object.fromEntries(data.entries()));

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Event updated successfully:", response.data);
      setSuccess(true);

      setTimeout(() => {
        navigate("/admin/events/");
      }, 2000);
    } catch (err) {
      console.error("Error updating event:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    setUpdateImg(false);
  };

  const addFormField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: "",
      type: "text",
      required: false,
      placeholder: "",
      options: [],
    };
    setFormData((prev) => ({
      ...prev,
      registrationFields: [...prev.registrationFields, newField],
    }));
  };

  const updateFormField = (index, field, value) => {
    setFormData((prev) => {
      const updatedFields = [...prev.registrationFields];
      updatedFields[index] = {
        ...updatedFields[index],
        [field]: value,
      };
      return {
        ...prev,
        registrationFields: updatedFields,
      };
    });
  };

  const removeFormField = (index) => {
    if (window.confirm("Are you sure you want to remove this field?")) {
      setFormData((prev) => ({
        ...prev,
        registrationFields: prev.registrationFields.filter((_, i) => i !== index),
      }));
    }
  };

  const addSelectOption = (fieldIndex) => {
    setFormData((prev) => {
      const updatedFields = [...prev.registrationFields];
      updatedFields[fieldIndex] = {
        ...updatedFields[fieldIndex],
        options: [...(updatedFields[fieldIndex].options || []), ""],
      };
      return {
        ...prev,
        registrationFields: updatedFields,
      };
    });
  };

  const updateSelectOption = (fieldIndex, optionIndex, value) => {
    setFormData((prev) => {
      const updatedFields = [...prev.registrationFields];
      const updatedOptions = [...(updatedFields[fieldIndex].options || [])];
      updatedOptions[optionIndex] = value;
      updatedFields[fieldIndex] = {
        ...updatedFields[fieldIndex],
        options: updatedOptions,
      };
      return {
        ...prev,
        registrationFields: updatedFields,
      };
    });
  };

  const removeSelectOption = (fieldIndex, optionIndex) => {
    setFormData((prev) => {
      const updatedFields = [...prev.registrationFields];
      updatedFields[fieldIndex] = {
        ...updatedFields[fieldIndex],
        options: updatedFields[fieldIndex].options.filter((_, i) => i !== optionIndex),
      };
      return {
        ...prev,
        registrationFields: updatedFields,
      };
    });
  };

  return (
    <>
      <Helmet>
        <title>
          {t("admin.dashboard.createEvent")} | Admin | Apang Seva Kendra
        </title>
      </Helmet>

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Edit Event
            </h1>
            <p className="text-gray-600">
              Update event information for your organization
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/events")}
            className="mt-4 md:mt-0 text-gray-600 hover:text-gray-800 transition duration-150 flex items-center gap-2"
          >
            ← Back to Events
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            Event updated successfully! Redirecting to events list...
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Image Upload */}
            <div className="text-center">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Event Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-black transition-colors">
                {imagePreview ? (
                  <div className="space-y-4 text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-40 w-60 object-cover rounded-lg shadow-lg"
                    />

                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Remove Image
                      </button>

                      <button
                        type="button"
                        onClick={updateImgEventHandler}
                        className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                          updateImg
                            ? "text-gray-600 border-gray-300 hover:bg-gray-50"
                            : "text-green-600 border-green-300 hover:bg-green-50"
                        }`}
                      >
                        {updateImg ? "Keep Old Image" : "Change Image"}
                      </button>
                    </div>

                    {updateImg && (
                      <div className="mt-3">
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer inline-block px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Select New Image
                        </label>
                        <input
                          id="image-upload"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Accepted: PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl text-gray-400 mb-2">🖼️</div>
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-block px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Upload Image
                    </label>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <div className="w-full">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="registrationRequired"
                      checked={formData.registrationRequired}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      Registration Required
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter event description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Date and Time Fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
                    errors.startDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
                    errors.startTime ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  min={formData.startDate}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
                    errors.endDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Registration Deadline
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  max={formData.endDate}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
                    errors.registrationDeadline
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.registrationDeadline && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.registrationDeadline}
                  </p>
                )}
              </div>
            </div>

            {/* Address and Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter event address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
                    errors.maxParticipants
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Maximum number of participants"
                />
                {errors.maxParticipants && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.maxParticipants}
                  </p>
                )}
              </div>
            </div>

            {/* Dynamic Registration Form Builder */}
            {formData.registrationRequired && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Registration Form Fields
                </label>
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                  {formData.registrationFields.map((field, index) => (
                    <div key={field.id || index} className="border rounded p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field Label *
                          </label>
                          <input
                            type="text"
                            value={field.label || ""}
                            onChange={(e) =>
                              updateFormField(index, "label", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Enter field label"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field Type *
                          </label>
                          <select
                            value={field.type || "text"}
                            onChange={(e) =>
                              updateFormField(index, "type", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                            value={field.placeholder || ""}
                            onChange={(e) =>
                              updateFormField(
                                index,
                                "placeholder",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Enter placeholder text"
                          />
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={field.required || false}
                              onChange={(e) =>
                                updateFormField(
                                  index,
                                  "required",
                                  e.target.checked
                                )
                              }
                              className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Required Field
                            </span>
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
                      {(field.type === "select" || field.type === "radio") && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Options
                          </label>
                          <div className="space-y-2">
                            {(field.options || []).map(
                              (option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) =>
                                      updateSelectOption(
                                        index,
                                        optionIndex,
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeSelectOption(index, optionIndex)
                                    }
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    ×
                                  </button>
                                </div>
                              )
                            )}
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
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-black hover:text-black transition-colors"
                  >
                    + Add Form Field
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/admin/events")}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
              >
                {t("admin.common.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  "Update Event"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EventEdit;

// import React, { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { Helmet } from "react-helmet-async";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import eventsService from "../../services/eventsService";

// const EventEdit = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const { eventId } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [updateImg, setUpdateImg] = useState(false);
//   const [oldImg, setOldImg] = useState();
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     startTime: "",
//     address: "",
//     registrationDeadline: "",
//     image: null,
//     status: "Upcoming",
//     maxParticipants: "",
//     registrationRequired: true,
//     registrationFields: [
//       {
//         id: "name",
//         label: "Full Name",
//         type: "text",
//         required: true,
//         placeholder: "Enter your full name",
//       },
//       {
//         id: "email",
//         label: "Email Address",
//         type: "email",
//         required: true,
//         placeholder: "Enter your email",
//       },
//       {
//         id: "phone",
//         label: "Phone Number",
//         type: "tel",
//         required: true,
//         placeholder: "Enter your phone number",
//       },
//     ],
//   });
//   const [errors, setErrors] = useState({});
//   const [imagePreview, setImagePreview] = useState(null);

//   const statusOptions = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

//   useEffect(() => {
//     const fetchEventsData = async () => {
//       const response = await eventsService.getById(eventId);
//       // console.log(response.data.images[0].url)
//       const { startDate, endDate, images, registrationDeadline, ...AllData } =
//         response.data;
//       const formatedStartDate = new Date(startDate).toISOString().split("T")[0];
//       const formatedEndDate = new Date(endDate).toISOString().split("T")[0];
//       const formatedRegDeadline = new Date(registrationDeadline)
//         .toISOString()
//         .split("T")[0];
//       const imgUrl = images[0].url;
//       // setFormData({startDate: formatedStartDate, endDate: formatedEndDate});
//       // Object.entries(AllData).map(([key,value]) => {
//       //   if(key != startDate || key != endDate)
//       //     setFormData({...formData, [key]: value})
//       // })

//       setImagePreview(imgUrl);
//       setOldImg(imgUrl);
//       const updatedFormData = {
//         ...AllData,
//         startDate: formatedStartDate,
//         endDate: formatedEndDate,
//         registrationDeadline: formatedRegDeadline,
//       };
//       setFormData(updatedFormData);
//     };
//     fetchEventsData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value, files, type, checked } = e.target;

//     if (name === "image" && files && files[0]) {
//       setFormData((prev) => ({ ...prev, [name]: files[0] }));
//       // Create preview URL
//       const reader = new FileReader();
//       reader.onload = (e) => setImagePreview(e.target.result);
//       reader.readAsDataURL(files[0]);
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: type === "checkbox" ? checked : value,
//       }));
//     }

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Required fields
//     if (!formData.title.trim()) newErrors.title = "Event title is required";
//     if (!formData.description.trim())
//       newErrors.description = "Description is required";
//     if (!formData.startDate) newErrors.startDate = "Start date is required";
//     if (!formData.endDate) newErrors.endDate = "End date is required";
//     if (!formData.address.trim()) newErrors.address = "Address is required";
//     if (!formData.startTime) newErrors.startTime = "Start time is required";

//     // Date validations
//     if (formData.startDate) {
//       const startDate = new Date(formData.startDate);
//       if (startDate < today) {
//         newErrors.startDate = "Start date cannot be in the past";
//       }
//     }

//     if (formData.startDate && formData.endDate) {
//       const startDate = new Date(formData.startDate);
//       const endDate = new Date(formData.endDate);
//       if (endDate < startDate) {
//         newErrors.endDate = "End date must be after start date";
//       }
//     }

//     if (formData.registrationDeadline && formData.endDate) {
//       const regDeadline = new Date(formData.registrationDeadline);
//       const endDate = new Date(formData.endDate);
//       if (regDeadline > endDate) {
//         newErrors.registrationDeadline =
//           "Registration deadline must be before end date";
//       }
//     }

//     if (formData.registrationDeadline) {
//       const regDeadline = new Date(formData.registrationDeadline);
//       if (regDeadline < today) {
//         newErrors.registrationDeadline =
//           "Registration deadline cannot be in the past";
//       }
//     }

//     // Max participants validation
//     if (
//       formData.maxParticipants &&
//       (isNaN(formData.maxParticipants) || formData.maxParticipants <= 0)
//     ) {
//       newErrors.maxParticipants = "Max participants must be a positive number";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const updateImgEventHandler = () => {
//     if(updateImg)
//       setImagePreview(oldImg);
//     setUpdateImg(!updateImg);
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       const data = new FormData();

//       // Add form fields according to your backend structure
//       data.append("title", formData.title);
//       data.append("description", formData.description);
//       data.append("startDate", formData.startDate);
//       data.append("endDate", formData.endDate);
//       data.append("startTime", formData.startTime);
//       data.append("address", formData.address);
//       data.append("status", formData.status);

//       if (formData.registrationDeadline) {
//         data.append("registrationDeadline", formData.registrationDeadline);
//       }

//       if (formData.maxParticipants) {
//         data.append("maxParticipants", formData.maxParticipants);
//       }

//       // Add registration fields
//       formData.registrationFields.forEach((field, index) => {
//         data.append(`registrationFields[${index}]`, JSON.stringify(field));
//       });
      
//       if (formData.image && updateImg) {
//         data.append("image", formData.image);
//       }

//       console.log("FormData being sent:", Object.fromEntries(data.entries()));

//       const response = await axios.put(
//         `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`,
//         data,
//         {
//           headers: { "Content-Type": "multipart/form-data" , authorization: `Bearer ${localStorage.getItem('token')}`},
//         },
//       );

//       console.log("Event created successfully:", response.data);
//       setSuccess(true);

//       // Reset form
//       setFormData({
//         title: "",
//         description: "",
//         startDate: "",
//         endDate: "",
//         startTime: "",
//         address: "",
//         registrationDeadline: "",
//         image: null,
//         status: "Upcoming",
//         maxParticipants: "",
//         registrationRequired: true,
//         registrationFields: [
//           {
//             id: "name",
//             label: "Full Name",
//             type: "text",
//             required: true,
//             placeholder: "Enter your full name",
//           },
//           {
//             id: "email",
//             label: "Email Address",
//             type: "email",
//             required: true,
//             placeholder: "Enter your email",
//           },
//           {
//             id: "phone",
//             label: "Phone Number",
//             type: "tel",
//             required: true,
//             placeholder: "Enter your phone number",
//           },
//         ],
//       });
//       setImagePreview(null);
//       setErrors({});

//       // Redirect to events list after a short delay
//       setTimeout(() => {
//         navigate("/admin/events/");
//       }, 2000);
//     } catch (err) {
//       console.error("Error creating event:", err);
//       setError(
//         err.response?.data?.message ||
//           "Failed to create event. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeImage = () => {
//     setFormData((prev) => ({ ...prev, image: null }));
//     setImagePreview(null);
//   };

//   // Form field management functions
//   const addFormField = () => {
//     const newField = {
//       id: `field_${Date.now()}`,
//       label: "",
//       type: "text",
//       required: false,
//       placeholder: "",
//       options: [],
//     };
//     setFormData((prev) => ({
//       ...prev,
//       registrationFields: [...prev.registrationFields, newField],
//     }));
//   };

//   const updateFormField = (index, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       registrationFields: prev.registrationFields.map((f, i) =>
//         i === index ? { ...f, [field]: value } : f
//       ),
//     }));
//   };

//   const removeFormField = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       registrationFields: prev.registrationFields.filter((_, i) => i !== index),
//     }));
//   };

//   const addSelectOption = (fieldIndex) => {
//     setFormData((prev) => ({
//       ...prev,
//       registrationFields: prev.registrationFields.map((f, i) =>
//         i === fieldIndex ? { ...f, options: [...(f.options || []), ""] } : f
//       ),
//     }));
//   };

//   const updateSelectOption = (fieldIndex, optionIndex, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       registrationFields: prev.registrationFields.map((f, i) =>
//         i === fieldIndex
//           ? {
//               ...f,
//               options: f.options.map((opt, oi) =>
//                 oi === optionIndex ? value : opt
//               ),
//             }
//           : f
//       ),
//     }));
//   };

//   const removeSelectOption = (fieldIndex, optionIndex) => {
//     setFormData((prev) => ({
//       ...prev,
//       registrationFields: prev.registrationFields.map((f, i) =>
//         i === fieldIndex
//           ? {
//               ...f,
//               options: f.options.filter((_, oi) => oi !== optionIndex),
//             }
//           : f
//       ),
//     }));
//   };

//   return (
//     <>
//       <Helmet>
//         <title>
//           {t("admin.dashboard.createEvent")} | Admin | Apang Seva Kendra
//         </title>
//       </Helmet>

//       <div className="p-6 bg-gray-50 min-h-screen">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">
//               {t("admin.dashboard.createEvent")}
//             </h1>
//             <p className="text-gray-600">
//               Create a new event for your organization
//             </p>
//           </div>
//           <button
//             onClick={() => navigate("/admin/events")}
//             className="mt-4 md:mt-0 text-gray-600 hover:text-gray-800 transition duration-150 flex items-center gap-2"
//           >
//             ← Back to Events
//           </button>
//         </div>

//         {error && (
//           <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
//             Event created successfully! Redirecting to events list...
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow-lg">
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             {/* Image Upload */}
//             <div className="text-center">
//               <label className="block text-sm font-semibold text-gray-700 mb-4">
//                 Event Image
//               </label>
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-black transition-colors">
//                 {imagePreview ? (
//                   <div className="space-y-4 text-center">
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       className="mx-auto h-40 w-60 object-cover rounded-lg shadow-lg"
//                     />

//                     <div className="flex justify-center gap-3">
//                       {/* Remove Image */}
//                       <button
//                         type="button"
//                         onClick={removeImage}
//                         className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
//                       >
//                         Remove Image
//                       </button>

//                       {/* Toggle Update Image */}
//                       <button
//                         type="button"
//                         onClick={() => updateImgEventHandler()}
//                         className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
//                           updateImg
//                             ? "text-gray-600 border-gray-300 hover:bg-gray-50"
//                             : "text-green-600 border-green-300 hover:bg-green-50"
//                         }`}
//                       >
//                         {updateImg ? "Keep Old Image" : "Change Image"}
//                       </button>
//                     </div>

//                     {/* Show File Upload only if admin clicks "Change Image" */}
//                     {updateImg && (
//                       <div className="mt-3">
//                         <label
//                           htmlFor="image-upload"
//                           className="cursor-pointer inline-block px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
//                         >
//                           Select New Image
//                         </label>
//                         <input
//                           id="image-upload"
//                           name="image"
//                           type="file"
//                           accept="image/*"
//                           onChange={handleInputChange}
//                           className="sr-only"
//                         />
//                         <p className="text-xs text-gray-500 mt-2">
//                           Accepted: PNG, JPG, GIF up to 10MB
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   // No Image Preview (Upload new image)
//                   <div className="text-center">
//                     <div className="text-4xl text-gray-400 mb-2">🖼️</div>
//                     <label
//                       htmlFor="image-upload"
//                       className="cursor-pointer inline-block px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
//                     >
//                       Upload Image
//                     </label>
//                     <input
//                       id="image-upload"
//                       name="image"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleInputChange}
//                       className="sr-only"
//                     />
//                     <p className="text-xs text-gray-500 mt-2">
//                       PNG, JPG, GIF up to 10MB
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Basic Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Event Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   required
//                   className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
//                     errors.title ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Enter event title"
//                 />
//                 {errors.title && (
//                   <p className="text-red-500 text-sm mt-1">{errors.title}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Status
//                 </label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//                 >
//                   {statusOptions.map((status) => (
//                     <option key={status} value={status}>
//                       {status}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex items-end">
//                 <div className="w-full">
//                   <label className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       name="registrationRequired"
//                       checked={formData.registrationRequired}
//                       onChange={handleInputChange}
//                       className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
//                     />
//                     <span className="text-sm font-semibold text-gray-700">
//                       Registration Required
//                     </span>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Event Description */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 required
//                 rows={4}
//                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
//                   errors.description ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter event description"
//               />
//               {errors.description && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.description}
//                 </p>
//               )}
//             </div>

//             {/* Date and Time Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Start Date *
//                 </label>
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleInputChange}
//                   required
//                   min={new Date().toISOString().split("T")[0]}
//                   className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
//                     errors.startDate ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.startDate && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.startDate}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Start Time *
//                 </label>
//                 <input
//                   type="time"
//                   name="startTime"
//                   value={formData.startTime}
//                   onChange={handleInputChange}
//                   required
//                   className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
//                     errors.startTime ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.startTime && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.startTime}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   End Date *
//                 </label>
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleInputChange}
//                   required
//                   min={
//                     formData.startDate || new Date().toISOString().split("T")[0]
//                   }
//                   className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
//                     errors.endDate ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.endDate && (
//                   <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Registration Deadline
//                 </label>
//                 <input
//                   type="date"
//                   name="registrationDeadline"
//                   value={formData.registrationDeadline}
//                   onChange={handleInputChange}
//                   min={new Date().toISOString().split("T")[0]}
//                   max={formData.endDate}
//                   className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
//                     errors.registrationDeadline
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.registrationDeadline && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.registrationDeadline}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Address and Capacity */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Address *
//                 </label>
//                 <input
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   required
//                   className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
//                     errors.address ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Enter event address"
//                 />
//                 {errors.address && (
//                   <p className="text-red-500 text-sm mt-1">{errors.address}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Max Participants
//                 </label>
//                 <input
//                   type="number"
//                   name="maxParticipants"
//                   value={formData.maxParticipants}
//                   onChange={handleInputChange}
//                   min="1"
//                   className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${
//                     errors.maxParticipants
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="Maximum number of participants"
//                 />
//                 {errors.maxParticipants && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.maxParticipants}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Dynamic Registration Form Builder */}
//             {formData.registrationRequired && (
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-4">
//                   Registration Form Fields
//                 </label>
//                 <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
//                   {formData.registrationFields.map((field, index) => (
//                     <div key={index} className="border rounded p-4 bg-white">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Field Label *
//                           </label>
//                           <input
//                             type="text"
//                             value={field.label}
//                             onChange={(e) =>
//                               updateFormField(index, "label", e.target.value)
//                             }
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//                             placeholder="Enter field label"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Field Type *
//                           </label>
//                           <select
//                             value={field.type}
//                             onChange={(e) =>
//                               updateFormField(index, "type", e.target.value)
//                             }
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//                           >
//                             <option value="text">Text</option>
//                             <option value="email">Email</option>
//                             <option value="tel">Phone</option>
//                             <option value="number">Number</option>
//                             <option value="textarea">Textarea</option>
//                             <option value="select">Select Dropdown</option>
//                             <option value="radio">Radio Buttons</option>
//                             <option value="checkbox">Checkbox</option>
//                           </select>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Placeholder Text
//                           </label>
//                           <input
//                             type="text"
//                             value={field.placeholder || ""}
//                             onChange={(e) =>
//                               updateFormField(
//                                 index,
//                                 "placeholder",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//                             placeholder="Enter placeholder text"
//                           />
//                         </div>
//                         <div className="flex items-center space-x-4">
//                           <label className="flex items-center">
//                             <input
//                               type="checkbox"
//                               checked={field.required}
//                               onChange={(e) =>
//                                 updateFormField(
//                                   index,
//                                   "required",
//                                   e.target.checked
//                                 )
//                               }
//                               className="mr-2"
//                             />
//                             <span className="text-sm font-medium text-gray-700">
//                               Required Field
//                             </span>
//                           </label>
//                           {index > 2 && ( // Don't allow removal of default fields
//                             <button
//                               type="button"
//                               onClick={() => removeFormField(index)}
//                               className="text-red-600 hover:text-red-800 text-sm font-medium"
//                             >
//                               Remove Field
//                             </button>
//                           )}
//                         </div>
//                       </div>

//                       {/* Options for select/radio fields */}
//                       {(field.type === "select" || field.type === "radio") && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Options
//                           </label>
//                           <div className="space-y-2">
//                             {(field.options || []).map(
//                               (option, optionIndex) => (
//                                 <div
//                                   key={optionIndex}
//                                   className="flex items-center space-x-2"
//                                 >
//                                   <input
//                                     type="text"
//                                     value={option}
//                                     onChange={(e) =>
//                                       updateSelectOption(
//                                         index,
//                                         optionIndex,
//                                         e.target.value
//                                       )
//                                     }
//                                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//                                     placeholder={`Option ${optionIndex + 1}`}
//                                   />
//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       removeSelectOption(index, optionIndex)
//                                     }
//                                     className="text-red-600 hover:text-red-800"
//                                   >
//                                     ×
//                                   </button>
//                                 </div>
//                               )
//                             )}
//                             <button
//                               type="button"
//                               onClick={() => addSelectOption(index)}
//                               className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                             >
//                               + Add Option
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}

//                   <button
//                     type="button"
//                     onClick={addFormField}
//                     className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-black hover:text-black transition-colors"
//                   >
//                     + Add Form Field
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Submit Button */}
//             <div className="flex justify-end space-x-3 pt-6 border-t">
//               <button
//                 type="button"
//                 onClick={() => navigate("/admin/events")}
//                 className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
//               >
//                 {t("admin.common.cancel")}
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 flex items-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     Creating...
//                   </>
//                 ) : (
//                   t("admin.common.create")
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EventEdit;
