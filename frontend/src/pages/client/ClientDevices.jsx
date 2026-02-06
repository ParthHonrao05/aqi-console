import { useState, useEffect } from 'react';
import { devicesAPI } from '../../services/api';
import Layout from '../../components/Layout';
import ErrorAlert from '../../components/ErrorAlert';

const ClientDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading your devices...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              My Devices
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              View all devices assigned to your account.
            </p>
          </div>
        </div>

        {error && (
          <ErrorAlert 
            message={error} 
            onClose={() => setError('')}
            className="mt-4"
          />
        )}

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
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
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                      >
                        Registered On
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800">
                    {devices.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-8 text-center text-sm text-gray-500 dark:text-gray-300"
                        >
                          No devices registered in the system yet
                        </td>
                      </tr>
                    ) : (
                      devices.map((device) => (
                        <tr key={device._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-gray-900 dark:text-gray-300 sm:pl-6">
                            {device.serialNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-gray-300">
                            {device.imeiNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                            {new Date(device.createdAt).toLocaleDateString()}
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
    </Layout>
  );
};

export default ClientDevices;