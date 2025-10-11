import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { eventsService } from '../../services/eventsService.js';

const EventsManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios(`${import.meta.env.VITE_API_BASE_URL}/events`);
      console.log(res.data.data);
      setEvents(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`,{
        //   headers: {
        //     authorization: `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        await eventsService.delete(eventId);
        setEvents(prev => prev.filter(event => event._id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const getEventStatus = (event) => {
    const today = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (event.status === 'Cancelled') return 'Cancelled';
    if (today < startDate) return 'Upcoming';
    if (today >= startDate && today <= endDate) return 'Ongoing';
    if (today > endDate) return 'Completed';
    return event.status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Ongoing': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('admin.common.events')} | Admin | Apang Seva Kendra</title>
      </Helmet>
      
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t('admin.common.events')}
            </h1>
            <p className="text-gray-600">Manage your organization's events and activities</p>
          </div>
          <button 
            onClick={() => navigate('/admin/events/create')}
            className="mt-4 md:mt-0 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-200 flex items-center gap-2 shadow-lg"
          >
            <span className="text-lg">+</span>
            {t('admin.common.add')} Event
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventStatus = getEventStatus(event);
              return (
                <div key={event._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  {/* Event Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {event.images && event.images.length > 0 ? (
                      <img
                        src={event.images[0].url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl text-gray-400">📅</div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(eventStatus)}`}>
                        {eventStatus}
                      </span>
                    </div>

                    {/* Registration Required Badge */}
                    {event.registrationRequired && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Registration Required
                        </span>
                      </div>
                    )}

                    {/* Action buttons overlay */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/events/edit/${event._id}`)}
                          className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200"
                          title="Edit Event"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white p-2 rounded-full shadow-lg transition-all duration-200"
                          title="Delete Event"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {event.description}
                      </p>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">📅</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {formatDate(event.startDate)}
                            {event.startTime && (
                              <span className="text-xs text-gray-500 ml-2">
                                at {formatTime(event.startTime)}
                              </span>
                            )}
                          </p>
                          {event.endDate && event.endDate !== event.startDate && (
                            <p className="text-xs text-gray-500">
                              to {formatDate(event.endDate)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">📍</span>
                        <span className="text-sm text-gray-600 line-clamp-1">{event.address}</span>
                      </div>

                      {event.maxParticipants && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400">👥</span>
                          <span className="text-sm text-gray-600">
                            {event.currentParticipants || 0}/{event.maxParticipants} participants
                          </span>
                        </div>
                      )}

                      {event.registrationDeadline && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400">⏰</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">Registration Deadline</p>
                            <p className="text-sm text-gray-700">{formatDate(event.registrationDeadline)}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t pt-4">
                      <button
                        onClick={() => navigate(`/admin/events/${event._id}/registrations`)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        View Registrations ({event.currentParticipants || 0})
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Empty State */}
            {events.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Added Yet</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first event</p>
                <button
                  onClick={() => navigate('/admin/events/create')}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-200"
                >
                  Create First Event
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default EventsManagement;