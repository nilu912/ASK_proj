import { useState, useEffect } from "react"
import { useTranslation } from "../../node_modules/react-i18next"
import { Helmet } from "react-helmet-async"

const Gallery = () => {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState("all")
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)

  // Categories would be fetched from API in a real implementation
  const categories = [
    { id: "all", name: t("gallery.categories.all") },
    { id: "events", name: t("gallery.categories.events") },
    { id: "activities", name: t("gallery.categories.activities") },
    { id: "facilities", name: t("gallery.categories.facilities") },
    { id: "testimonials", name: t("gallery.categories.testimonials") }
  ]

  // Mock data - would be fetched from API in a real implementation
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData = [
        {
          id: "1",
          type: "image",
          url: "/placeholder-gallery-1.jpg",
          thumbnail: "/placeholder-gallery-1.jpg",
          title: "Annual Charity Gala 2023",
          category: "events",
          createdAt: "2023-12-15"
        },
        {
          id: "2",
          type: "image",
          url: "/placeholder-gallery-2.jpg",
          thumbnail: "/placeholder-gallery-2.jpg",
          title: "Rehabilitation Center",
          category: "facilities",
          createdAt: "2023-10-10"
        },
        {
          id: "3",
          type: "video",
          url: "/placeholder-video.mp4",
          thumbnail: "/placeholder-video-thumbnail.jpg",
          title: "Success Story - Rahul",
          category: "testimonials",
          createdAt: "2023-09-05"
        },
        {
          id: "4",
          type: "image",
          url: "/placeholder-gallery-3.jpg",
          thumbnail: "/placeholder-gallery-3.jpg",
          title: "Skill Development Workshop",
          category: "activities",
          createdAt: "2023-08-20"
        },
        {
          id: "5",
          type: "image",
          url: "/placeholder-gallery-4.jpg",
          thumbnail: "/placeholder-gallery-4.jpg",
          title: "Community Sports Day",
          category: "events",
          createdAt: "2023-08-05"
        },
        {
          id: "6",
          type: "image",
          url: "/placeholder-gallery-5.jpg",
          thumbnail: "/placeholder-gallery-5.jpg",
          title: "Counseling Session",
          category: "activities",
          createdAt: "2023-07-15"
        },
        {
          id: "7",
          type: "video",
          url: "/placeholder-video-2.mp4",
          thumbnail: "/placeholder-video-thumbnail-2.jpg",
          title: "Testimonial - Priya",
          category: "testimonials",
          createdAt: "2023-06-30"
        },
        {
          id: "8",
          type: "image",
          url: "/placeholder-gallery-6.jpg",
          thumbnail: "/placeholder-gallery-6.jpg",
          title: "Computer Lab",
          category: "facilities",
          createdAt: "2023-06-10"
        }
      ]
      setGalleryItems(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredItems =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter(item => item.category === activeCategory)

  const openLightbox = item => {
    setSelectedItem(item)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedItem(null)
    document.body.style.overflow = "auto"
  }

  return (
    <>
      <Helmet>
        <title>{t("gallery.pageTitle")} | Apang Seva Kendra</title>
        <meta name="description" content={t("gallery.pageDescription")} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {t("gallery.title")}
        </h1>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 m-1 rounded-md ${
                activeCategory === category.id
                  ? "bg-accent text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => openLightbox(item)}
              >
                <div className="relative pb-[75%]">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1 truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">{t("gallery.noItems")}</p>
          </div>
        )}

        {/* Lightbox */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-5xl w-full">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <svg
                  className="w-8 h-8"
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

              {selectedItem.type === "image" ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="max-h-[80vh] mx-auto"
                />
              ) : (
                <div className="aspect-w-16 aspect-h-9">
                  <video
                    src={selectedItem.url}
                    controls
                    autoPlay
                    className="max-h-[80vh] mx-auto"
                  />
                </div>
              )}

              <div className="text-white text-center mt-4">
                <h3 className="text-xl font-semibold">{selectedItem.title}</h3>
                <p className="text-gray-300 mt-1">
                  {new Date(selectedItem.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Gallery
