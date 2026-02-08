import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { aqiAPI } from '../../services/api';
import Layout from '../../components/Layout';

const AqiDashboard = () => {
  const { deviceId } = useParams();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const res = await aqiAPI.getAqiHistory(deviceId);
        setReadings(res.data.readings || []);
      } catch (err) {
        console.error('Failed to fetch AQI data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, [deviceId]);

  if (loading) return <p className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">
    Loading AQI data...
  </p>;

  return (
    <Layout>
        <div className="px-4 sm:px-6 lg:px-8">  
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">AQI History</h1>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg
                                bg-white dark:bg-gray-800">
                            <table className="min-w-full text-sm divide-y divide-gray-300">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        PM2.5
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        PM10
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        Recieved At
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800">
                                {readings.map((r) => (
                                    <tr key={r._id}>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {r.pm25}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {r.pm10}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {new Date(r.createdAt).toLocaleString()}
                                    </td>
                                    </tr>
                                ))}
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

export default AqiDashboard;
