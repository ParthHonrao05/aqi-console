import { useState } from 'react';
import { usersAPI } from '../../services/api';
import Layout from '../../components/Layout';
import ErrorAlert from '../../components/ErrorAlert';
import { useEffect } from 'react';

const Admins = () => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [admins, setAdmins] = useState([]);

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
  });
  const fetchAdmins = async () => {
    const res = await usersAPI.getAllAdmins();
    setAdmins(res.data.admins);
  };
  useEffect(() => {
    fetchAdmins();
  }, []);


  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!formData.companyName || !formData.email || !formData.password) {
      setError('All fields are required');
      setSubmitting(false);
      return;
    }

    try {
      await usersAPI.createAdmin(formData);
      await fetchAdmins();
      setShowModal(false);
      setFormData({ companyName: '', email: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Admins</h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-md"
          >
            Add Admin
          </button>
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg
                                bg-white dark:bg-gray-800">
                    <table className="min-w-full text-sm divide-y divide-gray-300">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">
                            Company Name
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Email
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Role
                        </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800">
                        {admins.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="py-6 text-center text-sm text-gray-500 dark:text-gray-300">
                            No admins found
                            </td>
                        </tr>
                        ) : (
                        admins.map((admin) => (
                            <tr key={admin._id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                                {admin.companyName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                {admin.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                {admin.role}
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


        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Create Admin</h2>

              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Company Name"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border font-mono"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                />
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                >
                  Email
                </label>  
                <input
                  placeholder="Email"
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border font-mono"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                >
                  Password
                </label>
                <input
                  placeholder="Password"
                  type="password"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border font-mono"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary-600 text-white px-4 py-2 rounded"
                  >
                    {submitting ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admins;
