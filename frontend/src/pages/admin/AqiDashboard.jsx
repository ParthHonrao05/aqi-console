import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { aqiAPI, devicesAPI } from '../../services/api';
import Layout from '../../components/Layout';
import { io } from "socket.io-client";
import { useRef } from 'react';

const AqiDashboard = () => {
  const { deviceId } = useParams();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useRef(null);
  const [device, setDevice] = useState(null);
  const getAQILevel = (value) => {
    if (value <= 50) return "Good";
    if (value <= 100) return "Moderate";
    if (value <= 150) return "Unhealthy (Sensitive)";
    if (value <= 200) return "Unhealthy";
    if (value <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const getAQIColor = (value) => {
    if (value <= 50) return "bg-green-500";
    if (value <= 100) return "bg-yellow-400";
    if (value <= 150) return "bg-orange-400";
    if (value <= 200) return "bg-red-500";
    if (value <= 300) return "bg-purple-600";
    return "bg-maroon-700";
  };

  useEffect(() => {
    const fetchReadings = async () => {
        try {
        const res = await aqiAPI.getAqiHistory(deviceId);
        setReadings(res.data.readings || []);
        setDevice(res.data.device); // assuming backend returns device
        } catch (err) {
        console.error('Failed to fetch AQI data', err);
        } finally {
        setLoading(false);
        }
    };
    fetchReadings();
  }, [deviceId]);

  useEffect(() => {
    socket.current = io("http://localhost:5000");
    socket.current.on("connect", () => {
        console.log("Socket connected:", socket.current.id);
    });
    socket.current.on("newAQI", (data) => {
        setReadings(prev => [data, ...prev]);
    });
    return () => {
        socket.current.disconnect();
    };
  }, []);

  const handleReadStatus = async () => {
    try {
        await devicesAPI.readDevice(deviceId);
    } catch (err) {
        alert(err.response?.data?.message || "Read failed");
    }
  };
  const handleToggleStatus = async () => {
    try {
        await devicesAPI.toggleStatus(deviceId);
        const res = await aqiAPI.getAqiHistory(deviceId);
        setDevice(res.data.device);
    } catch (err) {
        console.error("Toggle failed", err);
    }
  };
  const handleDeleteRow = async (id) => {
    try {
        await aqiAPI.deleteReading(id);
        setReadings(prev => prev.filter(r => r._id !== id));
    } catch (err) {
        console.error("Delete failed", err);
    }
  };



  if (loading) return <p className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">
    Loading AQI data...
  </p>;

  return (
    <Layout>
        <div className="px-4 sm:px-6 lg:px-8">  
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">AQI History</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReadStatus}
                        className="bg-primary-600 text-white px-4 py-2 rounded-md"
                    >
                        Read Status
                    </button>
                    <button
                        onClick={() => handleToggleStatus()}
                        className={`px-3 py-1 rounded text-white ${device?.status === "ON" ? "bg-green-600" : "bg-red-600"}`}
                    >
                        {device?.status || "Loading..."}
                    </button>
                </div>

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
                                        Serial No.
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        Device Status
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        AQI Reading
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        Recieved At
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800">
                                    {readings.map((r, index) => (
                                    <tr key={r._id}>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            {index + 1}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {device?.status}
                                        </td>

                                        <td className={`${getAQIColor(r.aqi)} text-white px-2 py-1 rounded`}>
                                        {r.aqi} - {getAQILevel(r.aqi)}
                                        </td>

                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {new Date(r.createdAt).toLocaleString()}
                                        </td>

                                        <td>
                                        <button
                                            onClick={() => handleDeleteRow(r._id)}
                                            className="bg-red-600 text-white px-2 py-1 rounded"
                                        >
                                            Delete
                                        </button>
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
