import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import handlersService from "../../services/handlersService";

const HandlerEdit = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {handlerId} = useParams();
  const [updatePass, setUpdatePass] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(()=> {
    const fetchHandlerDataById = async() => {
        const response = await handlersService.getById(handlerId);
        setFormData(response.data)
    }
    fetchHandlerDataById();
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);

    try {
      const response = await handlersService.create(formData);
      console.log(response);

      setFormData({
        name: "",
        email: "",
        password: "",
      });
      navigate("/admin/handlers");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <>
      <Helmet>
        <title>{t("admin.common.handlers edit")} | Admin | Apang Seva Kendra</title>
      </Helmet>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t("admin.common.handlers")}
          </h1>
          <button
            onClick={() => navigate("/admin/handlers")}
            className="mt-4 md:mt-0 text-gray-600 hover:text-gray-800 transition duration-150 flex items-center gap-2"
          >
            ← Back to Events
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Handler Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${"border-gray-300"}`}
                  placeholder="Enter handler name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${"border-gray-300"}`}
                  placeholder="Enter handler email"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password (This is a hashed password, you can replace this password with new one)
                </label>
                { !updatePass ? <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${"border-gray-300"}`}
                  placeholder="Enter handler password"
                />: <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${"border-gray-300"}`}
                  placeholder="Enter handler password"
                /> }
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/handler")}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 transition duration-200"
                  >
                    {loading ? "Updating..." : "Edit Handler"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default HandlerEdit;
