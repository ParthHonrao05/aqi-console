import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import Layout from '../../components/Layout';
import ErrorAlert from '../../components/ErrorAlert';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await usersAPI.getAllClients();
      setClients(response.data.clients || []);
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to fetch clients';
      setError(errorMessage);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validate form data
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setSubmitting(false);
      return;
    }

    try {
      await usersAPI.createClient(formData);
      setShowCreateModal(false);
      setFormData({ username: '', email: '', password: '' });
      setError('');
      await fetchClients();
    } catch (err) {
      const errorMessage = err.message || 
                          err.response?.data?.message || 
                          (err.validationErrors ? err.validationErrors.map(e => e.msg).join(', ') : 'Failed to create client');
      setError(errorMessage);
      console.error('Error creating client:', err);
    } finally {
      setSubmitting(false);
    }
  };
  const handleDeleteClient = async (id) => {
    if (!window.confirm('Delete this client?')) return;

    try {
      await usersAPI.deleteClient(id);
      fetchClients();
    } catch (err) {
      setError('Failed to delete client');
    }
  };


  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading clients...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Clients</h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Add client
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
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 bg-white dark:bg-gray-800 sm:rounded-lg">
                <table className="min-w-full text-sm divide-y divide-gray-300">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6"
                      >
                        Username
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                      >
                        Created At
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                      >
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800">
                    {clients.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-8 text-center text-sm text-gray-500"
                        >
                          No clients found. Create your first client.
                        </td>
                      </tr>
                    ) : (
                      clients.map((client) => (
                        <tr key={client._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                            {client.username}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-100">
                            {client.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-100">
                            {new Date(client.createdAt).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-red-600">
                            <button
                              onClick={() => handleDeleteClient(client._id)}
                              className="hover:text-red-900 font-medium"
                            >
                              Delete
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

      {/* Create Client Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Create New Client</h2>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            <form onSubmit={handleCreateClient}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    required
                    minLength={3}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border font-mono"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border font-mono"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    required
                    minLength={6}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border font-mono"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
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
                    setFormData({ username: '', email: '', password: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Clients;