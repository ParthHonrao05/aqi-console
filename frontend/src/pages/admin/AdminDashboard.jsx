import { useEffect, useState } from "react";
import { devicesAPI } from "../../services/api";
import Layout from "../../components/Layout";

// const StatCard = ({ title, value, color }) => {
//   return (
//     <div className={`rounded-xl p-6 shadow-lg ${color} text-white`}>
//       <h2 className="text-lg font-medium opacity-90">{title}</h2>
//       <p className="text-3xl font-bold mt-2">{value}</p>
//     </div>
//   );
// };
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { FiTrendingUp } from "react-icons/fi";

const StatCard = ({ title, value, gradient }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`rounded-2xl p-6 shadow-xl bg-gradient-to-br ${gradient} relative overflow-hidden`}
    >
      <FiTrendingUp className="absolute top-4 right-4 opacity-30 text-5xl" />

      <h2 className="text-lg opacity-90">{title}</h2>

      <p className="text-4xl font-bold mt-4">
        <CountUp end={value} duration={1.5} />
      </p>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDevices: 0,
    onlineDevices: 0,
    totalClients: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await devicesAPI.getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
        <div className="px-6 py-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Admin Dashboard
            </h1>

            {/* Stat Cards */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
                title="Total Devices"
                value={stats.totalDevices}
                color="bg-blue-600"
            />
            <StatCard
                title="Online Devices"
                value={stats.onlineDevices}
                color="bg-green-600"
            />
            <StatCard
                title="Total Clients"
                value={stats.totalClients}
                color="bg-purple-600"
            />
            </div> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <StatCard
                    title="Total Devices"
                    value={stats.totalDevices}
                    gradient="from-blue-500 to-indigo-600"
                />

                <StatCard
                    title="Online Devices"
                    value={stats.onlineDevices}
                    gradient="from-green-500 to-emerald-600"
                />

                <StatCard
                    title="Total Clients"
                    value={stats.totalClients}
                    gradient="from-purple-500 to-pink-600"
                />
            </div>

            {/* Management Console */}
            {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Management Console
            </h2>

            <div className="flex flex-wrap gap-4">
                <a
                href="/admin/devices"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition"
                >
                Manage Devices
                </a>

                <a
                href="/admin/clients"
                className="px-6 py-3 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-800 transition"
                >
                View Clients
                </a>
            </div>
            </div> */}
            {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl"
                >
                <h2 className="text-xl font-semibold mb-6">Management Console</h2>

                <div className="flex flex-wrap gap-6">
                    <motion.a
                    whileHover={{ scale: 1.05 }}
                    href="/admin/devices"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg"
                    >
                    Manage Devices
                    </motion.a>

                    <motion.a
                    whileHover={{ scale: 1.05 }}
                    href="/admin/clients"
                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl shadow-lg"
                    >
                    View Clients
                    </motion.a>
                </div>
            </motion.div> */}
        </div>
    </Layout>
  );
};

export default AdminDashboard;
