import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// API base URL
const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Test credentials
const TEST_EMAIL = 'admin@askfoundation.org';
const TEST_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';

// Store auth token
let authToken: string = '';

/**
 * Test API endpoints
 */
const testApi = async () => {
  try {
    console.log('Testing API endpoints...');
    console.log('API URL:', API_URL);
    console.log('-----------------------------------');

    // Test health check endpoint
    await testHealthCheck();

    // Test auth endpoints
    await testAuth();

    // Test directors endpoints
    await testDirectors();

    // Test events endpoints
    await testEvents();

    // Test gallery endpoints
    await testGallery();

    // Test inquiries endpoints
    await testInquiries();

    // Test donations endpoints
    await testDonations();

    console.log('-----------------------------------');
    console.log('All tests completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('Error testing API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    process.exit(1);
  }
};

/**
 * Test health check endpoint
 */
const testHealthCheck = async () => {
  console.log('Testing health check endpoint...');
  const response = await axios.get(`${API_URL}/health`);
  console.log('Health check response:', response.data);
  console.log('Health check test passed!');
  console.log('-----------------------------------');
};

/**
 * Test auth endpoints
 */
const testAuth = async () => {
  console.log('Testing auth endpoints...');

  // Login
  console.log('Testing login...');
  const loginResponse = await axios.post(`${API_URL}/auth/login`, {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  console.log('Login response:', loginResponse.data);
  authToken = loginResponse.data.token;

  // Get current user
  console.log('Testing get current user...');
  const meResponse = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log('Current user:', meResponse.data);

  console.log('Auth tests passed!');
  console.log('-----------------------------------');
};

/**
 * Test directors endpoints
 */
const testDirectors = async () => {
  console.log('Testing directors endpoints...');

  // Get all directors
  console.log('Testing get all directors...');
  const directorsResponse = await axios.get(`${API_URL}/directors`);
  console.log('Directors count:', directorsResponse.data.count);

  // Create director
  console.log('Testing create director...');
  const createDirectorResponse = await axios.post(
    `${API_URL}/directors`,
    {
      name: 'Test Director',
      position: 'Test Position',
      bio: 'Test Bio',
      email: 'test@example.com',
      phone: '1234567890',
      socialMedia: {
        linkedin: 'https://linkedin.com/test',
        twitter: 'https://twitter.com/test',
      },
      order: 1,
      isActive: true,
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  console.log('Created director:', createDirectorResponse.data.data.name);
  const directorId = createDirectorResponse.data.data._id;

  // Get director by ID
  console.log('Testing get director by ID...');
  const directorResponse = await axios.get(`${API_URL}/directors/${directorId}`);
  console.log('Director name:', directorResponse.data.data.name);

  // Update director
  console.log('Testing update director...');
  const updateDirectorResponse = await axios.put(
    `${API_URL}/directors/${directorId}`,
    {
      name: 'Updated Director',
      position: 'Updated Position',
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  console.log('Updated director name:', updateDirectorResponse.data.data.name);

  // Delete director
  console.log('Testing delete director...');
  const deleteDirectorResponse = await axios.delete(`${API_URL}/directors/${directorId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log('Delete director response:', deleteDirectorResponse.data.success);

  console.log('Directors tests passed!');
  console.log('-----------------------------------');
};

/**
 * Test events endpoints
 */
const testEvents = async () => {
  console.log('Testing events endpoints...');

  // Get all events
  console.log('Testing get all events...');
  const eventsResponse = await axios.get(`${API_URL}/events`);
  console.log('Events count:', eventsResponse.data.count);

  // Create event
  console.log('Testing create event...');
  const createEventResponse = await axios.post(
    `${API_URL}/events`,
    {
      title: 'Test Event',
      description: 'Test Description',
      date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      time: '10:00 AM - 12:00 PM',
      location: 'Test Location',
      registrationFee: 0,
      organizer: 'Test Organizer',
      contactEmail: 'test@example.com',
      contactPhone: '1234567890',
      maxParticipants: 100,
      isActive: true,
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  console.log('Created event:', createEventResponse.data.data.title);
  const eventId = createEventResponse.data.data._id;

  // Get event by ID
  console.log('Testing get event by ID...');
  const eventResponse = await axios.get(`${API_URL}/events/${eventId}`);
  console.log('Event title:', eventResponse.data.data.title);

  // Register for event
  console.log('Testing register for event...');
  const registerEventResponse = await axios.post(`${API_URL}/events/${eventId}/register`, {
    name: 'Test Participant',
    email: 'participant@example.com',
    phone: '1234567890',
    address: 'Test Address',
    notes: 'Test Notes',
  });
  console.log('Registration ID:', registerEventResponse.data.data.registrationId);

  // Get event registrations
  console.log('Testing get event registrations...');
  const registrationsResponse = await axios.get(`${API_URL}/events/${eventId}/registrations`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log('Registrations count:', registrationsResponse.data.count);

  // Update event
  console.log('Testing update event...');
  const updateEventResponse = await axios.put(
    `${API_URL}/events/${eventId}`,
    {
      title: 'Updated Event',
      description: 'Updated Description',
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  console.log('Updated event title:', updateEventResponse.data.data.title);

  // Delete event
  console.log('Testing delete event...');
  const deleteEventResponse = await axios.delete(`${API_URL}/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log('Delete event response:', deleteEventResponse.data.success);

  console.log('Events tests passed!');
  console.log('-----------------------------------');
};

/**
 * Test gallery endpoints
 */
const testGallery = async () => {
  console.log('Testing gallery endpoints...');

  // Get all gallery items
  console.log('Testing get all gallery items...');
  const galleryResponse = await axios.get(`${API_URL}/gallery`);
  console.log('Gallery items count:', galleryResponse.data.count);

  // Create gallery item
  console.log('Testing create gallery item...');
  const createGalleryResponse = await axios.post(
    `${API_URL}/gallery`,
    {
      title: 'Test Gallery Item',
      description: 'Test Description',
      mediaType: 'image',
      category: 'events',
      tags: ['test', 'example'],
      isActive: true,
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  console.log('Created gallery item:', createGalleryResponse.data.data.title);
  const galleryId = createGalleryResponse.data.data._id;

  // Get gallery item by ID
  console.log('Testing get gallery item by ID...');
  const galleryItemResponse = await axios.get(`${API_URL}/gallery/${galleryId}`);
  console.log('Gallery item title:', galleryItemResponse.data.data.title);

  // Update gallery item
  console.log('Testing update gallery item...');
  const updateGalleryResponse = await axios.put(
    `${API_URL}/gallery/${galleryId}`,
    {
      title: 'Updated Gallery Item',
      description: 'Updated Description',
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  console.log('Updated gallery item title:', updateGalleryResponse.data.data.title);

  // Delete gallery item
  console.log('Testing delete gallery item...');
  const deleteGalleryResponse = await axios.delete(`${API_URL}/gallery/${galleryId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log('Delete gallery item response:', deleteGalleryResponse.data.success);

  console.log('Gallery tests passed!');
  console.log('-----------------------------------');
};

/**
 * Test inquiries endpoints
 */
const testInquiries = async () => {
  console.log('Testing inquiries endpoints...');

  // Create inquiry
  console.log('Testing create inquiry...');
  const createInquiryResponse = await axios.post(`${API_URL}/inquiries`, {
    name: 'Test Inquirer',
    email: 'inquirer@example.com',
    phone: '1234567890',
    subject: 'Test Subject',
    message: 'Test Message',
  });
  console.log('Created inquiry:', createInquiryResponse.data.data.subject);
  const inquiryId = createInquiryResponse.data.data._id;

  // Get all inquiries
  console.log('Testing get all inquiries...');
  const inquiriesResponse = await axios.get(`${API_URL}/inquiries`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log('Inquiries count:', inquiriesResponse.data.count);

  // Get inquiry by ID
  console.log('Testing get inquiry by ID...');
  const inquiryResponse = await axios.get(`${API_URL}/inquiries/${inquiryId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log('Inquiry subject:', inquiryResponse.data.data.subject);

  // Update inquiry
  console.log('Testing update inquiry...');
  const updateInquiryResponse = await axios.put(
    `${API_URL}/inquiries/${inquiryId}`,
    {
      status: 'in-progress',
      response: 'Test Response',
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  console.log('Updated inquiry status:', updateInquiryResponse.data.data.status);

  // Get inquiry stats
  console.log('Testing get inquiry stats...');
  const statsResponse = await axios.get(`${API_URL}/inquiries/stats`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log('Inquiry stats:', statsResponse.data.data);

  // Delete inquiry
  console.log('Testing delete inquiry...');
  const deleteInquiryResponse = await axios.delete(`${API_URL}/inquiries/${inquiryId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log('Delete inquiry response:', deleteInquiryResponse.data.success);

  console.log('Inquiries tests passed!');
  console.log('-----------------------------------');
};

/**
 * Test donations endpoints
 */
const testDonations = async () => {
  console.log('Testing donations endpoints...');

  // Create donation
  console.log('Testing create donation...');
  const createDonationResponse = await axios.post(`${API_URL}/donations`, {
    donorName: 'Test Donor',
    donorEmail: 'donor@example.com',
    donorPhone: '1234567890',
    donorAddress: 'Test Address',
    amount: 100,
    paymentStatus: 'completed',
    paymentMethod: 'credit_card',
    paymentReference: 'TEST123',
    paymentDate: new Date().toISOString(),
    notes: 'Test Donation',
  });
  console.log('Created donation ID:', createDonationResponse.data.data.donationId);
  const donationId = createDonationResponse.data.data._id;

  // Get all donations
  console.log('Testing get all donations...');
  const donationsResponse = await axios.get(`${API_URL}/donations`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log('Donations count:', donationsResponse.data.count);

  // Get donation by ID
  console.log('Testing get donation by ID...');
  const donationResponse = await axios.get(`${API_URL}/donations/${donationId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log('Donation amount:', donationResponse.data.data.amount);

  // Update donation
  console.log('Testing update donation...');
  const updateDonationResponse = await axios.put(
    `${API_URL}/donations/${donationId}`,
    {
      paymentStatus: 'completed',
      notes: 'Updated Notes',
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  console.log('Updated donation notes:', updateDonationResponse.data.data.notes);

  // Get donation stats
  console.log('Testing get donation stats...');
  const statsResponse = await axios.get(`${API_URL}/donations/stats`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log('Donation stats:', statsResponse.data.data);

  // Delete donation
  console.log('Testing delete donation...');
  const deleteDonationResponse = await axios.delete(`${API_URL}/donations/${donationId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log('Delete donation response:', deleteDonationResponse.data.success);

  console.log('Donations tests passed!');
  console.log('-----------------------------------');
};

// Run tests
testApi();