import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import directorsService from "../services/directorsService"
import eventsService from "../services/eventsService"
import galleryService from "../services/galleryService"

// Import components as needed
const HeroBanner = () => {
  const { t } = useTranslation()
  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url('/hero_banner.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content container">
        <h1>{t("home.hero.title")}</h1>
        <p>{t("home.hero.subtitle")}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "2rem"
          }}
        >
          <Link to="/donate" className="btn btn-primary">
            {t("home.hero.donateButton")}
          </Link>
          <Link to="/inquiry" className="btn btn-secondary">
            {t("home.hero.inquiryButton")}
          </Link>
        </div>
      </div>
    </div>
  )
}

const BoardOfDirectors = () => {
  const { t } = useTranslation()
  const [directors, setDirectors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const data = await directorsService.getAll()
        setDirectors(data.slice(0, 3)) // Show only first 3 directors
      } catch (error) {
        console.error('Error fetching directors:', error)
        // Fallback to mock data
        setDirectors([
          {
            id: 1,
            name: "Dr. Rajesh Kumar",
            qualification: "Ph.D. in Social Work",
            occupation: "Professor",
            photo: "/placeholder-person.jpg"
          },
          {
            id: 2,
            name: "Mrs. Priya Sharma",
            qualification: "M.S. in Healthcare Administration",
            occupation: "Healthcare Executive",
            photo: "/placeholder-person.jpg"
          },
          {
            id: 3,
            name: "Mr. Amit Patel",
            qualification: "MBA",
            occupation: "Business Consultant",
            photo: "/placeholder-person.jpg"
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchDirectors()
  }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("home.directors.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {directors.map(director => (
            <div
              key={director.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={director.photo}
                alt={director.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{director.name}</h3>
                <p className="text-gray-600 mb-1">{director.qualification}</p>
                <p className="text-gray-600 mb-4">{director.occupation}</p>
                <button className="text-accent hover:text-accent-dark font-medium">
                  {t("home.directors.readMore")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const AboutSection = () => {
  const { t } = useTranslation()

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
            <h2 className="text-3xl font-bold mb-6">{t("home.about.title")}</h2>
            <p className="text-gray-700 mb-4">{t("home.about.mission")}</p>
            <p className="text-gray-700 mb-4">{t("home.about.vision")}</p>
            <p className="text-gray-700">{t("home.about.goals")}</p>
          </div>
          <div className="lg:w-1/2">
            <img
              // This will be replaced with actual image from Cloudinary
              src="/placeholder-about.jpg"
              alt="About Apang Seva Kendra"
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

const ExperienceSection = () => {
  const { t } = useTranslation()

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("home.experience.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <div className="bg-gray-200 rounded-md flex items-center justify-center h-64">
                {/* This will be replaced with actual video from Cloudinary */}
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t("home.experience.story1.title")}
            </h3>
            <p className="text-gray-700">
              {t("home.experience.story1.description")}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <div className="bg-gray-200 rounded-md flex items-center justify-center h-64">
                {/* This will be replaced with actual video from Cloudinary */}
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t("home.experience.story2.title")}
            </h3>
            <p className="text-gray-700">
              {t("home.experience.story2.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const AchievementsSection = () => {
  const { t } = useTranslation()

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("home.achievements.title")}
        </h2>
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
            <img
              // This will be replaced with actual chart image
              src="/placeholder-chart.jpg"
              alt="Organization Achievements"
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
          <div className="lg:w-1/2">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                {t("home.achievements.summary")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-accent mt-0.5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{t("home.achievements.point1")}</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-accent mt-0.5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{t("home.achievements.point2")}</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-accent mt-0.5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{t("home.achievements.point3")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const GalleryPreview = () => {
  const { t } = useTranslation()

  // This would be fetched from API in a real implementation
  const galleryItems = [
    {
      id: 1,
      type: "image",
      src: "/placeholder-gallery-1.jpg",
      alt: "Gallery Image 1"
    },
    {
      id: 2,
      type: "image",
      src: "/placeholder-gallery-2.jpg",
      alt: "Gallery Image 2"
    },
    {
      id: 3,
      type: "image",
      src: "/placeholder-gallery-3.jpg",
      alt: "Gallery Image 3"
    },
    {
      id: 4,
      type: "image",
      src: "/placeholder-gallery-4.jpg",
      alt: "Gallery Image 4"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">{t("home.gallery.title")}</h2>
          <Link
            to="/gallery"
            className="text-accent hover:text-accent-dark font-medium"
          >
            {t("home.gallery.viewAll")}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const ActivitiesSection = () => {
  const { t } = useTranslation()

  // This would be fetched from API in a real implementation
  const activities = [
    {
      id: 1,
      title: "Rehabilitation Program",
      description:
        "Providing physical therapy and rehabilitation services to people with disabilities.",
      image: "/placeholder-activity-1.jpg"
    },
    {
      id: 2,
      title: "Skill Development",
      description:
        "Training programs to develop vocational skills for self-employment and independence.",
      image: "/placeholder-activity-2.jpg"
    },
    {
      id: 3,
      title: "Counseling Services",
      description:
        "Psychological support and counseling for individuals and families.",
      image: "/placeholder-activity-3.jpg"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("home.activities.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activities.map(activity => (
            <div
              key={activity.id}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                <p className="text-gray-700">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const EventsHighlights = () => {
  const { t } = useTranslation()

  // This would be fetched from API in a real implementation
  const events = [
    {
      id: 1,
      title: "Annual Charity Gala",
      date: "December 15",
      description:
        "Our flagship fundraising event with dinner, entertainment, and auction."
    },
    {
      id: 2,
      title: "Awareness Workshop",
      date: "March 10",
      description:
        "Educational workshop on disability rights and accessibility."
    },
    {
      id: 3,
      title: "Community Sports Day",
      date: "August 5",
      description: "Inclusive sports activities for people of all abilities."
    },
    {
      id: 4,
      title: "Health Camp",
      date: "October 20",
      description:
        "Free health check-ups and consultations for people with disabilities."
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">{t("home.events.title")}</h2>
          <Link
            to="/events"
            className="text-accent hover:text-accent-dark font-medium"
          >
            {t("home.events.viewAll")}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="text-accent font-semibold mb-2">{event.date}</div>
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-700 mb-4">{event.description}</p>
              <Link
                to={`/events/${event.id}`}
                className="text-accent hover:text-accent-dark font-medium"
              >
                {t("home.events.learnMore")}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TestimonialsSection = () => {
  const { t } = useTranslation()

  // This would be fetched from API in a real implementation
  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      quote:
        "The support I received from Apang Seva Kendra changed my life. Their rehabilitation program helped me regain mobility and confidence.",
      image: "/placeholder-testimonial-1.jpg"
    },
    {
      id: 2,
      name: "Priya Patel",
      quote:
        "Thanks to the skill development program, I was able to start my own small business and become financially independent.",
      image: "/placeholder-testimonial-2.jpg"
    },
    {
      id: 3,
      name: "Amit Kumar",
      quote:
        "The counseling services provided emotional support to my entire family during a difficult time. We are forever grateful.",
      image: "/placeholder-testimonial-3.jpg"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("home.testimonials.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-lg p-6 shadow-md"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <h3 className="text-lg font-semibold">{testimonial.name}</h3>
              </div>
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const DonationCTA = () => {
  const { t } = useTranslation()

  return (
    <section className="py-16 bg-accent bg-opacity-10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">{t("home.donation.title")}</h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
          {t("home.donation.description")}
        </p>
        <Link
          to="/donate"
          className="px-8 py-4 bg-accent text-gray-900 font-medium rounded-md hover:bg-opacity-90 transition-colors inline-block"
        >
          {t("home.donation.button")}
        </Link>
      </div>
    </section>
  )
}

const Home = () => {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>{t("home.pageTitle")} | Apang Seva Kendra</title>
        <meta name="description" content={t("home.pageDescription")} />
      </Helmet>

      <HeroBanner />
      <BoardOfDirectors />
      <AboutSection />
      <ExperienceSection />
      <AchievementsSection />
      <GalleryPreview />
      <ActivitiesSection />
      <EventsHighlights />
      <TestimonialsSection />
      <DonationCTA />
    </>
  )
}

export default Home
