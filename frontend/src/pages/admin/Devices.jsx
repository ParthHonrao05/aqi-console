import { useState, useEffect } from 'react';
import { devicesAPI } from '../../services/api';
import Layout from '../../components/Layout';
import ErrorAlert from '../../components/ErrorAlert';
import { useNavigate } from 'react-router-dom';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    serialNumber: '',
    imeiNumber: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate()


  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await devicesAPI.getAllDevices();
      setDevices(response.data.devices || []);
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to fetch devices';
      setError(errorMessage);
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDevice = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setError('');

  if (!formData.serialNumber || !formData.imeiNumber) {
    setError('All fields required');
    setSubmitting(false);
    return;
  }

  if (!/^[a-zA-Z0-9]{1,30}$/.test(formData.serialNumber)) {
    setError('Serial Number must be up to 30 alphanumeric characters');
    setSubmitting(false);
    return;
  }

  if (!/^\d{15}$/.test(formData.imeiNumber)) {
    setError('IMEI must be 15 digits');
    setSubmitting(false);
    return;
  }

  try {
    await devicesAPI.createDevice(formData);
    setShowCreateModal(false);
    setFormData({ serialNumber: '', imeiNumber: '' });
    await fetchDevices();
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to register device');
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading devices...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Devices</h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Add device
            </button>
          </div>
        </div>

        {error && !showCreateModal && (
          <ErrorAlert 
            message={error} 
            onClose={() => setError('')}
            className="mt-4"
          />
        )}

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 bg-white dark:bg-gray-800 sm:rounded-lg">
                <table className="min-w-full text-sm divide-y divide-gray-300">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6"
                      >
                        Serial Number 
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                      >
                        IMEI Number
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800">
                    {devices.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-8 text-center text-sm text-gray-500 dark:text-gray-100"
                        >
                          No devices found. Create your first device.
                        </td>
                      </tr>
                    ) : (
                      devices.map((device) => (
                        <tr key={device._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-gray-900 dark:text-gray-100 sm:pl-6">
                            {device.serialNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {device.imeiNumber}
                          </td>
                          <td>
                            <button onClick={() => navigate(`/admin/devices/${device._id}/aqi`)}
                               className="ml-4 inline-flex items-center text-xs sm:text-sm px-2 sm:px-3 py-1 border border-transparent font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                              View AQI
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Device Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">{'Register New Device'}</h2>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            <form onSubmit={handleCreateDevice}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="serialNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                  >
                    Serial Number (Max 30 alphanumeric characters)
                  </label>
                  <input
                    type="text"
                    id="serialNumber "
                    required
                    maxLength={30}
                    pattern="[a-zA-Z0-9]+"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border font-mono"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        serialNumber: e.target.value.replace(/[^a-zA-Z0-9]/g, ''),
                      })
                    }
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-100">
                    {formData.serialNumber.length}/Max 30 characters
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="imeiNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                  >
                    IMEI Number
                  </label>
                  <input
                    type="text"
                    id="imeiNumber"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border font-mono"
                    value={formData.imeiNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, imeiNumber: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError('');
                    setEditingDevice(null);
                    setFormData({
                      serialNumber : '',
                      imeiNumber: '',
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || formData.serialNumber.length === 0 || formData.serialNumber.length > 30}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {'Create Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Devices;