import { useState, useEffect } from "react"
import { useTranslation } from "../../node_modules/react-i18next"
import { Helmet } from "react-helmet-async"

const Events = () => {
  const { t } = useTranslation()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [formData, setFormData] = useState({})
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState("")

  // Mock data - would be fetched from API in a real implementation
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockEvents = [
        {
          id: "1",
          name: "Annual Charity Gala",
          date: "2023-12-15",
          description:
            "Join us for our flagship fundraising event with dinner, entertainment, and auction. All proceeds go towards supporting our rehabilitation programs.",
          location: "Grand Hotel, City Center",
          fees: 1500,
          image: "/placeholder-event-1.jpg",
          registrationFields: [
            {
              id: "name",
              label: t("events.form.name"),
              type: "text",
              required: true
            },
            {
              id: "email",
              label: t("events.form.email"),
              type: "email",
              required: true
            },
            {
              id: "phone",
              label: t("events.form.phone"),
              type: "tel",
              required: true
            },
            {
              id: "address",
              label: t("events.form.address"),
              type: "textarea",
              required: false
            },
            {
              id: "mealPreference",
              label: t("events.form.mealPreference"),
              type: "select",
              required: true,
              options: ["Vegetarian", "Non-Vegetarian", "Vegan"]
            }
          ]
        },
        {
          id: "2",
          name: "Awareness Workshop",
          date: "2023-03-10",
          description:
            "Educational workshop on disability rights, accessibility, and inclusion. Open to all community members interested in learning and advocating for disability rights.",
          location: "Community Center, East Wing",
          fees: null,
          image: "/placeholder-event-2.jpg",
          registrationFields: [
            {
              id: "name",
              label: t("events.form.name"),
              type: "text",
              required: true
            },
            {
              id: "email",
              label: t("events.form.email"),
              type: "email",
              required: true
            },
            {
              id: "phone",
              label: t("events.form.phone"),
              type: "tel",
              required: false
            },
            {
              id: "organization",
              label: t("events.form.organization"),
              type: "text",
              required: false
            }
          ]
        },
        {
          id: "3",
          name: "Community Sports Day",
          date: "2023-08-05",
          description:
            "Inclusive sports activities for people of all abilities. Join us for a day of fun, games, and community building through adaptive sports.",
          location: "City Sports Complex",
          fees: 200,
          image: "/placeholder-event-3.jpg",
          registrationFields: [
            {
              id: "name",
              label: t("events.form.name"),
              type: "text",
              required: true
            },
            {
              id: "email",
              label: t("events.form.email"),
              type: "email",
              required: true
            },
            {
              id: "phone",
              label: t("events.form.phone"),
              type: "tel",
              required: true
            },
            {
              id: "age",
              label: t("events.form.age"),
              type: "number",
              required: true
            },
            {
              id: "activityPreference",
              label: t("events.form.activityPreference"),
              type: "select",
              required: true,
              options: [
                "Basketball",
                "Table Tennis",
                "Chess",
                "Carrom",
                "Athletics"
              ]
            },
            {
              id: "specialRequirements",
              label: t("events.form.specialRequirements"),
              type: "textarea",
              required: false
            }
          ]
        },
        {
          id: "4",
          name: "Health Camp",
          date: "2023-10-20",
          description:
            "Free health check-ups and consultations for people with disabilities. Services include general health assessment, physiotherapy consultation, and assistive device evaluation.",
          location: "Apang Seva Kendra Main Center",
          fees: null,
          image: "/placeholder-event-4.jpg",
          registrationFields: [
            {
              id: "name",
              label: t("events.form.name"),
              type: "text",
              required: true
            },
            {
              id: "email",
              label: t("events.form.email"),
              type: "email",
              required: false
            },
            {
              id: "phone",
              label: t("events.form.phone"),
              type: "tel",
              required: true
            },
            {
              id: "age",
              label: t("events.form.age"),
              type: "number",
              required: true
            },
            {
              id: "medicalHistory",
              label: t("events.form.medicalHistory"),
              type: "textarea",
              required: false
            },
            {
              id: "consultationType",
              label: t("events.form.consultationType"),
              type: "select",
              required: true,
              options: [
                "General Health",
                "Physiotherapy",
                "Assistive Devices",
                "Psychological Counseling"
              ]
            }
          ]
        }
      ]
      setEvents(mockEvents)
      setLoading(false)
    }, 1000)
  }, [t])

  const handleRegisterClick = event => {
    setSelectedEvent(event)
    setShowRegistrationForm(true)
    setFormData({})
    setFormSuccess(false)
    setFormError("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    setFormSubmitting(true)
    setFormError("")

    // Validate required fields
    const missingFields = selectedEvent?.registrationFields
      .filter(field => field.required && !formData[field.id])
      .map(field => field.label)

    if (missingFields && missingFields.length > 0) {
      setFormError(t("events.form.missingFields") + missingFields.join(", "))
      setFormSubmitting(false)
      return
    }

    // Simulate API call to submit registration
    setTimeout(() => {
      setFormSubmitting(false)
      setFormSuccess(true)
      // In a real implementation, this would send the data to the backend
      console.log("Registration submitted:", {
        eventId: selectedEvent?.id,
        formData
      })
    }, 1500)
  }

  const closeRegistrationForm = () => {
    setShowRegistrationForm(false)
    setSelectedEvent(null)
  }

  // Filter to show only upcoming events
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    const today = new Date()
    return eventDate >= today
  })

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
                      {selectedEvent.registrationFields.map(field => (
                        <div key={field.id}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>

                          {field.type === "textarea" ? (
                            <textarea
                              id={field.id}
                              value={formData[field.id] || ""}
                              onChange={e =>
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
                              onChange={e =>
                                handleInputChange(field.id, e.target.value)
                              }
                              required={field.required}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                            >
                              <option value="">
                                {t("events.form.selectOption")}
                              </option>
                              {field.options?.map(option => (
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
                              onChange={e =>
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
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold">{event.name}</h2>
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
  )
}

export default Events
