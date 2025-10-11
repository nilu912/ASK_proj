import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { inquiriesService } from "../../services/inquiriesService.js";
import { useAuth } from "../../context/AuthContext.jsx";

const HandlerDashboard = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {logout} = useAuth()
  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    applySearch();
  }, [inquiries, searchTerm]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await inquiriesService.getAll();

      if (response.success) {
        setInquiries(response.data);
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      if (err.response?.status === 401) {
        navigate("/query-handler/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const applySearch = () => {
    let filtered = [...inquiries];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.subject?.toLowerCase().includes(searchLower) ||
          q.email?.toLowerCase().includes(searchLower) ||
          q.name?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredInquiries(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setResponseMessage("");
    setShowModal(true);
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();

    if (!responseMessage.trim()) {
      alert("Please enter a response message");
      return;
    }

    setSubmitting(true);
    try {
      const response = await inquiriesService.reply(selectedInquiry._id, {
        message: responseMessage,
        responseType: "email",
      });

      if (response.success) {
        alert("Response submitted successfully!");
        setResponseMessage("");
        await fetchInquiries();
        setShowModal(false);
      }
    } catch (err) {
      console.error("Error submitting response:", err);
      alert("Failed to submit response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Handler Dashboard | Apang Seva Kendra</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    Inquiry Handler Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">
                    View and respond to user inquiries
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Total Inquiries</h2>
                <p className="text-blue-100">
                  Manage and respond to all user queries
                </p>
              </div>
              <div className="text-6xl font-bold opacity-90">
                {inquiries.length}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                User Inquiries
              </h2>
              <span className="text-sm text-gray-600">
                {filteredInquiries.length} inquiries
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-gray-600">No inquiries found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInquiries.map((inquiry) => (
                      <tr key={inquiry._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {inquiry.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {inquiry.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {inquiry.phone || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {inquiry.subject}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {inquiry.resolved?'Completed':'Pending'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewInquiry(inquiry)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View & Respond
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Inquiry Detail & Response Modal */}
        {showModal && selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-gray-800">
                  Inquiry Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    User Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {selectedInquiry.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {selectedInquiry.email}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Phone:</span>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {selectedInquiry.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Date:</span>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {new Date(selectedInquiry.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inquiry Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Inquiry
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Subject:</label>
                      <p className="text-base font-medium text-gray-900 mt-1">
                        {selectedInquiry.subject}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Message:</label>
                      <div className="mt-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                          {selectedInquiry.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Previous Responses */}
                {selectedInquiry.responses &&
                  selectedInquiry.responses.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Previous Responses ({selectedInquiry.responses.length})
                      </h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedInquiry.responses.map((response, index) => (
                          <div
                            key={index}
                            className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500"
                          >
                            <p className="text-sm text-gray-900 mb-2 whitespace-pre-wrap">
                              {response.message}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>
                                Responded by:{" "}
                                {response.respondedBy?.name || "Handler"}
                              </span>
                              <span>
                                {new Date(
                                  response.respondedAt
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Response Form */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Add Your Response
                  </h4>
                  <form onSubmit={handleSubmitResponse}>
                    <textarea
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="Type your response here..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      required
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {submitting ? (
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
                            Submitting...
                          </span>
                        ) : (
                          "Submit Response"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = `mailto:${
                            selectedInquiry.email
                          }?subject=Re: ${
                            selectedInquiry.subject
                          }&body=${encodeURIComponent(responseMessage || "")}`;
                        }}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                      >
                        Send via Email
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end sticky bottom-0">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HandlerDashboard;
