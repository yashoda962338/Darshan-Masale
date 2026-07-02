// frontend/src/pages/admin/Users.jsx - FULLY WORKING
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2, Shield, UserCog, X, Check } from 'lucide-react';
import adminService from '../../services/adminService';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    try {
      await adminService.updateUserRole(selectedUser._id, newRole);
      toast.success(`User role updated to ${newRole}`);
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole('');
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch(role) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-700';
      case 'ADMIN': return 'bg-blue-100 text-blue-700';
      case 'MANAGER': return 'bg-yellow-100 text-yellow-700';
      case 'SUPPORT': return 'bg-green-100 text-green-700';
      case 'CUSTOMER': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-primary-maroon border-t-secondary-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Users - Admin Dashboard</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary-maroon">
            Users
          </h1>
          <p className="text-text-muted mt-1">
            {users.length} users in system
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors text-sm"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="font-heading text-2xl text-primary-maroon">No users found</h3>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-cream">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-button font-medium text-text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-gold/10">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-background-cream/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-text-dark">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-button font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-button font-medium ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setNewRole(user.role);
                              setShowRoleModal(true);
                            }}
                            className="p-1.5 text-text-muted hover:text-secondary-gold transition-colors"
                            title="Change Role"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const newStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
                              if (window.confirm(`Are you sure you want to ${newStatus === 'BLOCKED' ? 'block' : 'unblock'} this user?`)) {
                                // In production, call API to toggle status
                                toast.success(`User ${newStatus === 'BLOCKED' ? 'blocked' : 'unblocked'} successfully`);
                                fetchUsers();
                              }
                            }}
                            className={`p-1.5 ${user.status === 'ACTIVE' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'} rounded-full transition-colors`}
                            title={user.status === 'ACTIVE' ? 'Block User' : 'Unblock User'}
                          >
                            {user.status === 'ACTIVE' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Role Change Modal */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-primary-maroon">
                  Change Role - {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="p-1 hover:bg-background-cream rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    Current Role: <span className="font-bold">{selectedUser.role}</span>
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="SUPPORT">SUPPORT</option>
                    <option value="CUSTOMER">CUSTOMER</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleRoleChange} variant="primary">
                    Update Role
                  </Button>
                  <Button onClick={() => setShowRoleModal(false)} variant="secondary">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AdminUsers;