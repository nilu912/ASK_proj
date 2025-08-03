import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const DonationsManagement = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Mock data with comprehensive donation details
  const donations = [
    {
      id: 1,
      donorName: 'Alice Brown',
      donorEmail: 'alice.brown@email.com',
      donorPhone: '9876543210',
      address: '123 MG Road, Pune, Maharashtra 411001',
      idType: 'pan',
      idNumber: 'ABCDE1234F',
      amount: 5000,
      currency: 'INR',
      status: 'completed',
      paymentMethod: 'upi',
      razorpay: {
        orderId: 'order_MbQK2EEuoUmb6o',
        paymentId: 'pay_MbQK2EEuoUmb6o',
        signature: 'abc123signature'
      },
      receiptNumber: 'RCP20250801001',
      taxDeductible: true,
      createdAt: '2025-08-01T10:30:00Z',
      emailNotifications: {
        confirmationSent: true,
        thankYouSent: true,
        receiptSent: true
      }
    },
    {
      id: 2,
      donorName: 'Bob Smith',
      donorEmail: 'bob.smith@email.com', 
      donorPhone: '9123456789',
      address: '456 FC Road, Mumbai, Maharashtra 400001',
      idType: 'aadhar',
      idNumber: '123412341234',
      amount: 15000,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'card',
      razorpay: {
        orderId: 'order_NcQK3FFvpVnc7p',
        paymentId: null,
        signature: null
      },
      receiptNumber: null,
      taxDeductible: true,
      createdAt: '2025-07-25T14:20:00Z',
      emailNotifications: {
        confirmationSent: false,
        thankYouSent: false,
        receiptSent: false
      }
    },
    {
      id: 3,
      donorName: 'Priya Sharma',
      donorEmail: 'priya.sharma@email.com',
      donorPhone: '9876501234',
      address: '789 Koregaon Park, Pune, Maharashtra 411001',
      idType: 'pan',
      idNumber: 'PQRST5678U',
      amount: 2500,
      currency: 'INR',
      status: 'completed',
      paymentMethod: 'netbanking',
      razorpay: {
        orderId: 'order_OdRL4GGwqWod8q',
        paymentId: 'pay_OdRL4GGwqWod8q',
        signature: 'def456signature'
      },
      receiptNumber: 'RCP20250730002',
      taxDeductible: true,
      createdAt: '2025-07-30T09:15:00Z',
      emailNotifications: {
        confirmationSent: true,
        thankYouSent: true,
        receiptSent: true
      }
    },
    {
      id: 4,
      donorName: 'Rajesh Kumar',
      donorEmail: 'rajesh.kumar@email.com',
      donorPhone: '9988776655',
      address: '321 Bandra West, Mumbai, Maharashtra 400050',
      idType: 'aadhar',
      idNumber: '567856785678',
      amount: 10000,
      currency: 'INR',
      status: 'failed',
      paymentMethod: 'wallet',
      razorpay: {
        orderId: 'order_PeSM5HHxrXpe9r',
        paymentId: null,
        signature: null
      },
      receiptNumber: null,
      taxDeductible: true,
      paymentFailureReason: 'Insufficient balance in wallet',
      createdAt: '2025-07-28T16:45:00Z',
      emailNotifications: {
        confirmationSent: false,
        thankYouSent: false,
        receiptSent: false
      }
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('admin.common.donations')} | Admin | Apang Seva Kendra</title>
      </Helmet>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t('admin.common.donations')}
          </h1>
          <button className="mt-4 md:mt-0 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark transition duration-150">
            {t('admin.common.add')} Donation
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
                      Donor Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount & Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Razorpay Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Receipt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {donation.donorName}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {donation.donorEmail}
                            </div>
                            <div className="text-sm text-gray-500">
                              📱 {donation.donorPhone}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {donation.idType.toUpperCase()}: {donation.idNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            ₹{donation.amount.toLocaleString()}
                          </div>
                          <div className="text-gray-500 capitalize">
                            {donation.paymentMethod}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs space-y-1">
                          <div className="text-gray-600">
                            <span className="font-medium">Order:</span> 
                            <span className="font-mono">{donation.razorpay.orderId}</span>
                          </div>
                          {donation.razorpay.paymentId && (
                            <div className="text-gray-600">
                              <span className="font-medium">Payment:</span> 
                              <span className="font-mono">{donation.razorpay.paymentId}</span>
                            </div>
                          )}
                          {donation.razorpay.signature && (
                            <div className="text-gray-600">
                              <span className="font-medium">Verified:</span> 
                              <span className="text-green-600">✓</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            donation.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : donation.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {donation.status.toUpperCase()}
                          </span>
                          {donation.receiptNumber && (
                            <div className="text-xs text-gray-600">
                              Receipt: {donation.receiptNumber}
                            </div>
                          )}
                          <div className="text-xs">
                            <div className={`inline-flex items-center ${
                              donation.emailNotifications.receiptSent ? 'text-green-600' : 'text-gray-400'
                            }`}>
                              {donation.emailNotifications.receiptSent ? '✓' : '✗'} Receipt Sent
                            </div>
                          </div>
                          {donation.paymentFailureReason && (
                            <div className="text-xs text-red-600">
                              {donation.paymentFailureReason}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-2">
                          <button className="text-accent hover:text-accent-dark text-left">
                            {t('admin.common.view')}
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 text-left">
                            Send Receipt
                          </button>
                          {donation.status === 'pending' && (
                            <button className="text-green-600 hover:text-green-900 text-left">
                              Mark Complete
                            </button>
                          )}
                          <button className="text-red-600 hover:text-red-900 text-left">
                            {t('admin.common.delete')}
                          </button>
                        </div>
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

export default DonationsManagement;
