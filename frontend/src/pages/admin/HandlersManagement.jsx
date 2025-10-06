import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import handlersService from "../../services/handlersService";

const HandlersManagement = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [handlers, setHandlers] = useState([]);
  // Mock data
  // const handlers = [
  //   {
  //     id: 1,
  //     name: "Chris Evans",
  //     role: "Event Coordinator",
  //     email: "chris@example.com",
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  //     name: "Emma Watson",
  //     role: "Volunteer Manager",
  //     email: "emma@example.com",
  //     status: "Inactive",
  //   },
  // ];

  useEffect(() => {
    fetchHandlersData();
  }, []);

  const fetchHandlersData = async () => {
    const response = await handlersService.getAll();
    console.log(response.data);
    setHandlers(response.data);
  };

  const deleteHandler = async (id) => {
    const result = window.confirm("Are you sure you want to delete this user?");
    if (result)
      try {
        const response = await handlersService.delete(id);
        console.log(response.data);
        fetchHandlersData();
      } catch (err) {
        console.error(err);
      }
  };
  return (
    <>
      <Helmet>
        <title>{t("admin.common.handlers")} | Admin | Apang Seva Kendra</title>
      </Helmet>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t("admin.common.handlers")}
          </h1>
          <button
            onClick={() => navigate("/admin/handlers/create")}
            className="mt-4 md:mt-0 bg-black text-white px-4 py-2 rounded-md hover:bg-accent-dark transition duration-150"
          >
            {t("admin.common.add")} Handler
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
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("admin.common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {handlers.map((handler) => (
                    <tr key={handler._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {handler.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {handler.role}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {handler.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            handler.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {handler.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-accent hover:text-accent-dark mr-3"
                          onClick={() =>
                            navigate(`/admin/handlers/edit/${handler._id}`)
                          }
                        >
                          {t("admin.common.edit")}
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => deleteHandler(handler._id)}
                        >
                          {t("admin.common.delete")}
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

export default HandlersManagement;
