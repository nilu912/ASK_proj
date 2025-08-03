import { useState, useEffect } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import { Helmet } from "react-helmet-async";

const Events = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/events`
        );
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const processed = data.data.map((event) => {
            const start = event.startDate?.$date || event.startDate;
            return {
              _id: event._id,
              title: event.title,
              description: event.description,
              location: event.address || event.location,
              fees: event.fees,
              image:
                event.images?.[0]?.url ||
                event.image ||
                "/placeholder-event.jpg",
              registrationFields: (event.registrationFields || []).map((f) =>
                typeof f === "string" ? JSON.parse(f) : f
              ),
              startDate: new Date(start),
            };
          });
          setEvents(processed);
        } else {
          throw new Error("Failed to fetch events");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
    setFormData({});
    setFormSuccess(false);
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError("");

    // Validate required fields
    const missingFields = selectedEvent?.registrationFields
      .filter((field) => field.required && !formData[field.id])
      .map((field) => field.label);

    if (missingFields && missingFields.length > 0) {
      setFormError(t("events.form.missingFields") + missingFields.join(", "));
      setFormSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/reg/events/${
          selectedEvent._id
        }/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setFormSubmitting(false);
        setFormSuccess(true);
      } else {
        setFormError(data.message || "Registration failed");
        setFormSubmitting(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setFormError("Failed to submit registration. Please try again.");
      setFormSubmitting(false);
    }
  };

  const closeRegistrationForm = () => {
    setShowRegistrationForm(false);
    setSelectedEvent(null);
  };

  // Filter to show only upcoming events
  const upcomingEvents = events.filter((ev) => {
    const today = new Date();
    return ev.startDate instanceof Date && ev.startDate >= today;
  });

  return (
    <>
      <Helmet>
        <title>{t("events.pageTitle")} | Apang Seva Kendra</title>
        <meta name="description" content={t("events.pageDescription")} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Registration Form Modal */}
        {showRegistrationForm && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {t("events.register.title")}: {selectedEvent.name}
                  </h2>
                  <button
                    onClick={closeRegistrationForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {formSuccess ? (
                  <div className="text-center py-8">
                    <svg
                      className="w-16 h-16 text-green-500 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">
                      {t("events.register.success.title")}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {t("events.register.success.message")}
                    </p>
                    <button
                      onClick={closeRegistrationForm}
                      className="px-6 py-2 bg-accent text-white rounded-md hover:bg-opacity-90"
                    >
                      {t("events.register.success.close")}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {formError && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {formError}
                      </div>
                    )}

                    <div className="space-y-4">
                      {selectedEvent.registrationFields.map((field) => (
                        <div key={field.id}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>

                          {field.type === "radio" ? (
                            <div className="space-y-2">
                              {field.options?.map((option) => (
                                <label
                                  key={option}
                                  className="inline-flex items-center mr-4"
                                >
                                  <input
                                    type="radio"
                                    name={field.id}
                                    value={option}
                                    checked={formData[field.id] === option}
                                    onChange={(e) =>
                                      handleInputChange(
                                        field.id,
                                        e.target.value
                                      )
                                    }
                                    required={field.required}
                                    className="form-radio text-accent"
                                  />
                                  <span className="ml-2">{option}</span>
                                </label>
                              ))}
                            </div>
                          ) : field.type === "textarea" ? (
                            <textarea
                              id={field.id}
                              value={formData[field.id] || ""}
                              onChange={(e) =>
                                handleInputChange(field.id, e.target.value)
                              }
                              required={field.required}
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                              rows={4}
                            />
                          ) : field.type === "select" ? (
                            <select
                              id={field.id}
                              value={formData[field.id] || ""}
                              onChange={(e) =>
                                handleInputChange(field.id, e.target.value)
                              }
                              required={field.required}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                            >
                              <option value="">
                                {t("events.form.selectOption")}
                              </option>
                              {field.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              id={field.id}
                              value={formData[field.id] || ""}
                              onChange={(e) =>
                                handleInputChange(field.id, e.target.value)
                              }
                              required={field.required}
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="w-full px-6 py-3 bg-accent text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            {t("events.register.submitting")}
                          </span>
                        ) : (
                          t("events.register.submit")
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-8 text-center">
          {t("events.title")}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                    <span className="bg-accent bg-opacity-20 text-accent px-2 py-1 rounded-md text-sm font-medium">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="mb-4">
                    <div className="flex items-start mb-2">
                      <svg
                        className="w-5 h-5 text-gray-500 mr-2 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    {event.fees !== null && (
                      <div className="flex items-start">
                        <svg
                          className="w-5 h-5 text-gray-500 mr-2 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>
                          {event.fees > 0 ? `₹${event.fees}` : t("events.free")}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRegisterClick(event)}
                    className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    {t("events.register.button")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-xl font-semibold mb-2">
              {t("events.noEvents.title")}
            </h2>
            <p className="text-gray-600">{t("events.noEvents.message")}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Events;
