// frontend/src/pages/admin/Customers.jsx - FULLY CONNECTED TO API
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter, Loader2, X, Check } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0, limit: 10 });

  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, searchTerm]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      };
      const data = await adminService.getCustomers(params);
      setCustomers(data.customers || []);
      setPagination(data.pagination || { page: 1, total: 0, pages: 0, limit: 10 });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (id, currentStatus) => {
    const action = currentStatus === 'ACTIVE' ? 'block' : 'unblock';
    if (!window.confirm(`Are you sure you want to ${action} this customer?`)) return;

    try {
      if (currentStatus === 'ACTIVE') {
        await adminService.blockCustomer(id);
        toast.success('Customer blocked successfully');
      } else {
        await adminService.unblockCustomer(id);
        toast.success('Customer unblocked successfully');
      }
      fetchCustomers();
    } catch (error) {
      toast.error(error.message || `Failed to ${action} customer`);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await adminService.deleteCustomer(id);
      toast.success('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      toast.error(error.message || 'Failed to delete customer');
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-12 h-12 text-primary-maroon animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Customers - Admin Dashboard</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary-maroon">
            Customers
          </h1>
          <p className="text-text-muted mt-1">
            {pagination.total} customers total
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors text-sm"
            />
          </div>
        </div>

        {customers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="font-heading text-2xl text-primary-maroon">No customers found</h3>
            <p className="text-text-muted mt-2">Customers will appear here once they register</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-cream">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-button font-medium text-text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-gold/10">
                  {customers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-background-cream/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-text-dark">
                        {customer.firstName} {customer.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-text-muted">{customer.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-text-muted">{customer.orderCount || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-button font-medium ${
                          customer.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                          customer.status === 'BLOCKED' ? 'bg-red-100 text-red-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {customer.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to={`/admin/customers/${customer._id}`} 
                            className="p-1.5 text-text-muted hover:text-primary-maroon transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleBlockToggle(customer._id, customer.status)}
                            className={`p-1.5 ${
                              customer.status === 'ACTIVE' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'
                            } rounded-full transition-colors`}
                            title={customer.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                          >
                            {customer.status === 'ACTIVE' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-gold/10">
                <p className="text-sm text-text-muted">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-full border border-secondary-gold/20 hover:bg-primary-maroon hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 rounded-full border border-secondary-gold/20 hover:bg-primary-maroon hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Customers;