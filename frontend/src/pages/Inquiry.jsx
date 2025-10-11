import { useState } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import { Helmet } from "react-helmet-async";
import { inquiriesService } from "../services/inquiriesService.js";

const Inquiry = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    file: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [inquiryId, setInquiryId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = t("inquiry.form.errors.nameRequired");
    }

    if (!formData.email.trim()) {
      errors.email = t("inquiry.form.errors.emailRequired");
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = t("inquiry.form.errors.emailInvalid");
    }

    if (!formData.phone.trim()) {
      errors.phone = t("inquiry.form.errors.phoneRequired");
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      errors.phone = t("inquiry.form.errors.phoneInvalid");
    }

    if (!formData.subject.trim()) {
      errors.subject = t("inquiry.form.errors.subjectRequired");
    }

    if (!formData.message.trim()) {
      errors.message = t("inquiry.form.errors.messageRequired");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await inquiriesService.create(formData);
      if (res.success) {
        setIsSubmitting(false);
        setSubmitStatus("success");
      } else {
        setIsSubmitting(false);
        setSubmitStatus("Something went wrong!");
      }
    } catch (err) {
      setIsSubmitting(false);
      setSubmitStatus("Something went wrong!");
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      file: null,
    });
    setFormErrors({});
    setSubmitStatus("idle");
    setInquiryId(null);
  };

  return (
    <>
      <Helmet>
        <title>{t("inquiry.pageTitle")} | Apang Seva Kendra</title>
        <meta name="description" content={t("inquiry.pageDescription")} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {t("inquiry.title")}
        </h1>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            {submitStatus === "idle" ? (
              <>
                <p className="text-gray-600 mb-6">{t("inquiry.description")}</p>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("inquiry.form.name")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.name ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-accent focus:border-accent`}
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("inquiry.form.email")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-accent focus:border-accent`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("inquiry.form.phone")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.phone
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-accent focus:border-accent`}
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("inquiry.form.subject")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.subject
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-accent focus:border-accent`}
                      />
                      {formErrors.subject && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("inquiry.form.message")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className={`w-full px-3 py-2 border ${
                          formErrors.message
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-accent focus:border-accent`}
                      />
                      {formErrors.message && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.message}
                        </p>
                      )}
                    </div>

                    {/* File Upload */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="file"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("inquiry.form.file")}
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-accent hover:text-accent-dark focus-within:outline-none"
                            >
                              <span>{t("inquiry.form.uploadFile")}</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                              />
                            </label>
                            <p className="pl-1">{t("inquiry.form.dragDrop")}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {t("inquiry.form.fileTypes")}
                          </p>
                          {formData.file && (
                            <p className="text-sm text-gray-600 mt-2">
                              {t("inquiry.form.selectedFile")}:{" "}
                              {formData.file.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-accent text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting
                        ? t("inquiry.form.submitting")
                        : t("inquiry.form.submit")}
                    </button>
                  </div>
                </form>
              </>
            ) : submitStatus === "success" ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-green-500 mx-auto mb-6"
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
                <h2 className="text-xl font-semibold mb-2">
                  {t("inquiry.success.title")}
                </h2>
                <p className="text-gray-600 mb-2">
                  {t("inquiry.success.message")}
                </p>
                {inquiryId && (
                  <p className="text-gray-600 mb-6">
                    {t("inquiry.success.inquiryId")}:{" "}
                    <span className="font-semibold">{inquiryId}</span>
                  </p>
                )}
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-accent text-white rounded-md hover:bg-opacity-90"
                >
                  {t("inquiry.success.newInquiry")}
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-red-500 mx-auto mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-xl font-semibold mb-2">
                  {t("inquiry.error.title")}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t("inquiry.error.message")}
                </p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="px-6 py-2 bg-accent text-white rounded-md hover:bg-opacity-90"
                >
                  {t("inquiry.error.tryAgain")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Inquiry;
