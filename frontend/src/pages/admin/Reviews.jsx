// frontend/src/pages/admin/Reviews.jsx - FULLY WORKING
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
Star,
CheckCircle,
XCircle,
Search,
ChevronLeft,
ChevronRight,
Trash2
} from "lucide-react";
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0, limit: 10 });

    useEffect(() => {
        fetchReviews();
    }, [pagination.page, searchTerm, statusFilter]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                search: searchTerm,
                status: statusFilter,
            };
            const data = await adminService.getReviews(params);

            setReviews(Array.isArray(data) ? data : []);

            setPagination({
                page: 1,
                total: Array.isArray(data) ? data.length : 0,
                pages: 1,
                limit: 10
            });
        } catch (error) {
            toast.error(error.message || 'Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, isApproved) => {
        try {
            await adminService.updateReviewStatus(id, isApproved);
            toast.success(`Review ${isApproved ? 'approved' : 'rejected'} successfully`);
            fetchReviews();
        } catch (error) {
            toast.error(error.message || 'Failed to update review');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await adminService.deleteReview(id);
            toast.success('Review deleted successfully');
            fetchReviews();
        } catch (error) {
            toast.error(error.message || 'Failed to delete review');
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-secondary-gold text-secondary-gold' : 'text-text-muted/30'}`} />
        ));
    };

    if (loading && reviews.length === 0) {
        return (
            <div className="flex justify-center py-16">
                <div className="w-12 h-12 border-4 border-primary-maroon border-t-secondary-gold rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Reviews - Admin Dashboard</title>
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold text-primary-maroon">
                        Reviews
                    </h1>
                    <p className="text-text-muted mt-1">
                        {pagination.total} reviews total
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPagination({ ...pagination, page: 1 });
                            }}
                            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors text-sm"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPagination({ ...pagination, page: 1 });
                        }}
                        className="px-4 py-2 rounded-full bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors text-sm"
                    >
                        <option value="">All Reviews</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                    </select>
                </div>

                {reviews.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
                        <div className="text-6xl mb-4">⭐</div>
                        <h3 className="font-heading text-2xl text-primary-maroon">No reviews found</h3>
                        <p className="text-text-muted mt-2">Reviews will appear here once customers submit them</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-background-cream">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Review</th>
                                        <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-button font-medium text-text-muted uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-gold/10">
                                    {reviews.map((review) => (
                                        <tr key={review._id} className="hover:bg-background-cream/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-text-dark">
                                                {review.userId?.firstName} {review.userId?.lastName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-muted">
                                                {review.productId?.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-muted max-w-xs truncate">
                                                {review.comment || review.title || 'No comment'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-button font-medium ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {review.isApproved ? 'Approved' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!review.isApproved && (
                                                        <button
                                                            onClick={() => updateStatus(review._id, true)}
                                                            className="p-1.5 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {review.isApproved && (
                                                        <button
                                                            onClick={() => updateStatus(review._id, false)}
                                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(review._id)}
                                                        className="p-1.5 text-text-muted hover:text-red-500 rounded-full transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {pagination.pages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-gold/10">
                                <p className="text-sm text-text-muted">
                                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} reviews
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

export default AdminReviews;