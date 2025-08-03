import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

const EventsManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  // Mock data
  // const events = [
  //   {
  //     id: 1,
  //     name: 'Annual Charity Run',
  //     date: '12th December, 2025',
  //     location: 'Central Park',
  //     status: 'Upcoming'
  //   },
  //   {
  //     id: 2,
  //     name: 'Gala Night',
  //     date: '5th November, 2025',
  //     location: 'Grand Hotel',
  //     status: 'Concluded'
  //   }
  // ];

  useEffect(()=>{
    const getData = async()=>{
      try{
        const res = await axios(`${import.meta.env.VITE_API_BASE_URL}/events`);
        console.log(res.data.data);
        setEvents(res.data.data)
      }catch(err){
        console.log(err)
        return;
      }
    }
    getData();
  },[])


  return (
    <>
      <Helmet>
        <title>{t('admin.common.events')} | Admin | Apang Seva Kendra</title>
      </Helmet>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t('admin.common.events')}
          </h1>
          <button 
            onClick={() => navigate('/admin/events/create')}
            className="mt-4 md:mt-0 bg-accent bg-black text-white px-4 py-2 rounded-md hover:bg-accent-dark transition duration-150"
          >
            {t('admin.common.add')} Event
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
                      Event Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
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
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{event.endDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{event.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${event.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => navigate(`/admin/events/${event._id}/registrations`)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View Registrations
                        </button>
                        <button className="text-accent hover:text-accent-dark mr-3">
                          {t('admin.common.edit')}
                        </button>
                        <button className="text-red-600 hover:text-red-900">
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
      </div>
    </>
  );
};

export default EventsManagement;
