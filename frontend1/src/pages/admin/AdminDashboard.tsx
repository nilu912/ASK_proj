import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for dashboard statistics
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalInquiries: 0,
    resolvedInquiries: 0,
    pendingInquiries: 0,
    totalGalleryItems: 0,
  });

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on selected date range
      const mockData = {
        week: {
          totalDonations: 12,
          totalAmount: 25000,
          totalEvents: 2,
          totalRegistrations: 18,
          totalInquiries: 8,
          resolvedInquiries: 5,
          pendingInquiries: 3,
          totalGalleryItems: 45,
        },
        month: {
          totalDonations: 48,
          totalAmount: 120000,
          totalEvents: 5,
          totalRegistrations: 72,
          totalInquiries: 32,
          resolvedInquiries: 24,
          pendingInquiries: 8,
          totalGalleryItems: 65,
        },
        year: {
          totalDonations: 580,
          totalAmount: 1450000,
          totalEvents: 24,
          totalRegistrations: 864,
          totalInquiries: 384,
          resolvedInquiries: 350,
          pendingInquiries: 34,
          totalGalleryItems: 120,
        },
      };
      
      setStats(mockData[dateRange]);
      setIsLoading(false);
    };
    
    fetchData();
  }, [dateRange]);

  // Chart data for donations
  const donationChartData = {
    labels: dateRange === 'week' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : dateRange === 'month'
      ? Array.from({ length: 30 }, (_, i) => (i + 1).toString())
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: t('admin.dashboard.donationAmount'),
        data: dateRange === 'week'
          ? [3000, 5000, 2000, 8000, 4000, 2000, 1000]
          : dateRange === 'month'
          ? Array.from({ length: 30 }, () => Math.floor(Math.random() * 10000))
          : [120000, 85000, 100000, 150000, 120000, 130000, 90000, 100000, 140000, 160000, 180000, 175000],
        backgroundColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for inquiries
  const inquiryChartData = {
    labels: [t('admin.dashboard.resolved'), t('admin.dashboard.pending')],
    datasets: [
      {
        data: [stats.resolvedInquiries, stats.pendingInquiries],
        backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(239, 68, 68, 0.6)'],
        borderColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('admin.dashboard.donationTrend'),
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('admin.dashboard.inquiryStatus'),
      },
    },
  };

  // Stat card component
  const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-2">{value}</p>
        </div>
        <div className="p-3 bg-accent bg-opacity-10 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{t('admin.dashboard.pageTitle')} | Apang Seva Kendra</title>
      </Helmet>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">{t('admin.dashboard.title')}</h1>
          
          <div className="mt-4 md:mt-0">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setDateRange('week')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${dateRange === 'week' ? 'bg-accent text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {t('admin.dashboard.week')}
              </button>
              <button
                type="button"
                onClick={() => setDateRange('month')}
                className={`px-4 py-2 text-sm font-medium ${dateRange === 'month' ? 'bg-accent text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {t('admin.dashboard.month')}
              </button>
              <button
                type="button"
                onClick={() => setDateRange('year')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${dateRange === 'year' ? 'bg-accent text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {t('admin.dashboard.year')}
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title={t('admin.dashboard.totalDonations')}
                value={stats.totalDonations}
                icon={
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
              <StatCard
                title={t('admin.dashboard.totalAmount')}
                value={`₹${stats.totalAmount.toLocaleString()}`}
                icon={
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                title={t('admin.dashboard.totalEvents')}
                value={stats.totalEvents}
                icon={
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <StatCard
                title={t('admin.dashboard.totalRegistrations')}
                value={stats.totalRegistrations}
                icon={
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                }
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <Bar options={barChartOptions} data={donationChartData} />
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <Doughnut options={doughnutChartOptions} data={inquiryChartData} />
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">{t('admin.dashboard.inquiryStats')}</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{t('admin.dashboard.totalInquiries')}</span>
                      <span className="text-sm font-medium text-gray-700">{stats.totalInquiries}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-accent h-2.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{t('admin.dashboard.resolved')}</span>
                      <span className="text-sm font-medium text-gray-700">{stats.resolvedInquiries}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(stats.resolvedInquiries / stats.totalInquiries) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{t('admin.dashboard.pending')}</span>
                      <span className="text-sm font-medium text-gray-700">{stats.pendingInquiries}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(stats.pendingInquiries / stats.totalInquiries) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">{t('admin.dashboard.quickActions')}</h2>
                <div className="space-y-3">
                  <a href="/admin/events/create" className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition duration-150">
                    <svg className="h-5 w-5 text-accent mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>{t('admin.dashboard.createEvent')}</span>
                  </a>
                  <a href="/admin/gallery/upload" className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition duration-150">
                    <svg className="h-5 w-5 text-accent mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{t('admin.dashboard.uploadMedia')}</span>
                  </a>
                  <a href="/admin/inquiries" className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition duration-150">
                    <svg className="h-5 w-5 text-accent mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span>{t('admin.dashboard.manageInquiries')}</span>
                  </a>
                  <a href="/admin/donations" className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition duration-150">
                    <svg className="h-5 w-5 text-accent mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{t('admin.dashboard.exportDonations')}</span>
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">{t('admin.dashboard.recentActivity')}</h2>
                <div className="space-y-4">
                  {/* Mock recent activities */}
                  {[
                    { action: t('admin.dashboard.newDonation'), time: '10 minutes ago', amount: '₹5,000' },
                    { action: t('admin.dashboard.eventRegistration'), time: '1 hour ago', event: 'Annual Charity Run' },
                    { action: t('admin.dashboard.inquiryResolved'), time: '3 hours ago', id: 'INQ2345' },
                    { action: t('admin.dashboard.mediaUploaded'), time: '5 hours ago', count: 5 },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-accent bg-opacity-10 flex items-center justify-center">
                          <span className="text-accent text-xs font-medium">{index + 1}</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                          {activity.amount && <span className="font-semibold"> {activity.amount}</span>}
                          {activity.event && <span className="font-semibold"> {activity.event}</span>}
                          {activity.id && <span className="font-semibold"> {activity.id}</span>}
                          {activity.count && <span className="font-semibold"> ({activity.count})</span>}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;