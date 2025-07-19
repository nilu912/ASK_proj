import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

interface DonationFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  idType: 'pan' | 'aadhar';
  idNumber: string;
  amount: number;
  agreeToTerms: boolean;
}

const Donation = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<DonationFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    idType: 'pan',
    idNumber: '',
    amount: 1000,
    agreeToTerms: false,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof DonationFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success' | 'failure'>('form');
  const [receiptUrl, setReceiptUrl] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (formErrors[name as keyof DonationFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof DonationFormData, string>> = {};
    
    if (!formData.name.trim()) {
      errors.name = t('donation.form.errors.nameRequired');
    }
    
    if (!formData.email.trim()) {
      errors.email = t('donation.form.errors.emailRequired');
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = t('donation.form.errors.emailInvalid');
    }
    
    if (!formData.phone.trim()) {
      errors.phone = t('donation.form.errors.phoneRequired');
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errors.phone = t('donation.form.errors.phoneInvalid');
    }
    
    if (!formData.address.trim()) {
      errors.address = t('donation.form.errors.addressRequired');
    }
    
    if (!formData.idNumber.trim()) {
      errors.idNumber = t('donation.form.errors.idRequired');
    } else if (
      (formData.idType === 'pan' && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.idNumber)) ||
      (formData.idType === 'aadhar' && !/^\d{12}$/.test(formData.idNumber))
    ) {
      errors.idNumber = t('donation.form.errors.idInvalid');
    }
    
    if (!formData.amount || formData.amount < 100) {
      errors.amount = t('donation.form.errors.amountInvalid');
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = t('donation.form.errors.termsRequired');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setPaymentStep('processing');
    
    // Simulate payment processing with Razorpay
    // In a real implementation, this would integrate with the Razorpay API
    setTimeout(() => {
      // Simulate successful payment
      setPaymentStep('success');
      setIsSubmitting(false);
      setReceiptUrl('/sample-receipt.pdf'); // This would be a real URL to the generated PDF in a real implementation
    }, 3000);
  };

  const handleRetrieveReceipt = () => {
    // In a real implementation, this would open a modal to enter phone/PAN/Aadhar
    // and then fetch the receipt from the backend
    alert(t('donation.receipt.retrieveMessage'));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      idType: 'pan',
      idNumber: '',
      amount: 1000,
      agreeToTerms: false,
    });
    setFormErrors({});
    setPaymentStep('form');
    setReceiptUrl('');
  };

  return (
    <>
      <Helmet>
        <title>{t('donation.pageTitle')} | Apang Seva Kendra</title>
        <meta name="description" content={t('donation.pageDescription')} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">{t('donation.title')}</h1>
        
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Terms and Conditions Modal */}
          {showTerms && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{t('donation.terms.title')}</h2>
                    <button
                      onClick={() => setShowTerms(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="prose max-w-none">
                    <h3>{t('donation.terms.section1.title')}</h3>
                    <p>{t('donation.terms.section1.content')}</p>
                    
                    <h3>{t('donation.terms.section2.title')}</h3>
                    <p>{t('donation.terms.section2.content')}</p>
                    
                    <h3>{t('donation.terms.section3.title')}</h3>
                    <p>{t('donation.terms.section3.content')}</p>
                    
                    <h3>{t('donation.terms.section4.title')}</h3>
                    <p>{t('donation.terms.section4.content')}</p>
                  </div>
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowTerms(false)}
                      className="px-6 py-2 bg-accent text-white rounded-md hover:bg-opacity-90"
                    >
                      {t('donation.terms.close')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">
            {paymentStep === 'form' && (
              <>
                <p className="text-gray-600 mb-6">{t('donation.description')}</p>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('donation.form.name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-accent focus:border-accent`}
                      />
                      {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('donation.form.email')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-accent focus:border-accent`}
                      />
                      {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('donation.form.phone')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-accent focus:border-accent`}
                      />
                      {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('donation.form.address')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full px-3 py-2 border ${formErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-accent focus:border-accent`}
                      />
                      {formErrors.address && <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>}
                    </div>

                    {/* ID Type */}
                    <div>
                      <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('donation.form.idType')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="idType"
                        name="idType"
                        value={formData.idType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                      >
                        <option value="pan">{t('donation.form.pan')}</option>
                        <option value="aadhar">{t('donation.form.aadhar')}</option>
                      </select>
                    </div>

                    {/* ID Number */}
                    <div>
                      <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        {formData.idType === 'pan' ? t('donation.form.panNumber') : t('donation.form.aadharNumber')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="idNumber"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${formErrors.idNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-accent focus:border-accent`}
                      />
                      {formErrors.idNumber && <p className="mt-1 text-sm text-red-500">{formErrors.idNumber}</p>}
                    </div>

                    {/* Amount */}
                    <div className="md:col-span-2">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('donation.form.amount')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          min="100"
                          value={formData.amount}
                          onChange={handleInputChange}
                          className={`w-full pl-8 pr-3 py-2 border ${formErrors.amount ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-accent focus:border-accent`}
                        />
                      </div>
                      {formErrors.amount && <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[500, 1000, 2000, 5000, 10000].map(amount => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, amount }))}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
                          >
                            ₹{amount}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="md:col-span-2">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="agreeToTerms"
                            name="agreeToTerms"
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                            {t('donation.form.agreeToTerms')}{' '}
                            <button
                              type="button"
                              onClick={() => setShowTerms(true)}
                              className="text-accent hover:text-accent-dark underline"
                            >
                              {t('donation.form.viewTerms')}
                            </button>
                          </label>
                        </div>
                      </div>
                      {formErrors.agreeToTerms && <p className="mt-1 text-sm text-red-500">{formErrors.agreeToTerms}</p>}
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-accent text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('donation.form.submit')}
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    {t('donation.receipt.retrieve')}{' '}
                    <button
                      type="button"
                      onClick={handleRetrieveReceipt}
                      className="text-accent hover:text-accent-dark underline"
                    >
                      {t('donation.receipt.click')}
                    </button>
                  </p>
                </div>
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent mx-auto mb-6"></div>
                <h2 className="text-xl font-semibold mb-2">{t('donation.processing.title')}</h2>
                <p className="text-gray-600">{t('donation.processing.message')}</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-semibold mb-2">{t('donation.success.title')}</h2>
                <p className="text-gray-600 mb-6">{t('donation.success.message')}</p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 inline-block"
                  >
                    {t('donation.success.downloadReceipt')}
                  </a>
                  <button
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    {t('donation.success.donateAgain')}
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'failure' && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-semibold mb-2">{t('donation.failure.title')}</h2>
                <p className="text-gray-600 mb-6">{t('donation.failure.message')}</p>
                
                <button
                  onClick={() => setPaymentStep('form')}
                  className="px-6 py-2 bg-accent text-white rounded-md hover:bg-opacity-90"
                >
                  {t('donation.failure.tryAgain')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Donation;