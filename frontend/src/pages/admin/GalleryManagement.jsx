import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import galleryService from "../../services/galleryService";

const GalleryManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);   
  const [photos, setPhotos] = useState([]) 

  useEffect(()=>{
    getData();
  },[loading])

  const getData = async () => {
    setLoading(true);
    try{
      const data = await galleryService.getAll();
      console.log(data.data)
      setPhotos(data.data);
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  }

  const deleteGallery = async (id) => {
    setLoading(true);
    try{
      const res = await galleryService.delCategory(id);
      console.log(res);
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>{t('admin.common.gallery')} | Admin | Apang Seva Kendra</title>
      </Helmet>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t('admin.common.gallery')}
          </h1>
          <button 
            onClick={() => navigate('/admin/gallery/upload')}
            className="mt-4 bg-black md:mt-0 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark transition duration-150"
          >
            {t('admin.dashboard.uploadMedia')}
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
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {photos.map((photo) => (
                    <tr key={photo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-md" src={photo.poster.url} alt={photo.title} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{photo.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{photo.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-accent hover:text-accent-dark mr-3">
                          {t('admin.common.edit')}
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={()=> deleteGallery(photo.id)}>
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

export default GalleryManagement;
