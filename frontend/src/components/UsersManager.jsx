import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMail, FiCalendar, FiShield } from 'react-icons/fi';
import { userService } from '../services/api';

const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
    });

    useEffect(() => {
        fetchUsers();
    }, [pagination.page]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers({
                page: pagination.page,
                limit: pagination.limit
            });
            setUsers(response.data || response);
            if (response.pagination) {
                setPagination(prev => ({ ...prev, ...response.pagination }));
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const filteredUsers = users.filter(user =>
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && users.length === 0) return (
        <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="relative w-full max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
                    />
                </div>
                <div className="text-gray-400 text-sm">
                    Total Users: <span className="text-white font-bold">{pagination.total}</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 border-b border-white/10">
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Member Since</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {filteredUsers.map((user) => (
                            <motion.tr
                                key={user._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-gray-300 hover:bg-white/5 transition-colors"
                            >
                                <td className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                            {user.displayName?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{user.displayName}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <FiMail className="scale-75" /> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin'
                                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20'
                                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                                        }`}>
                                        <FiShield className="inline mr-1" />
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm flex items-center gap-2">
                                        <FiCalendar className="text-gray-500" />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                                        View Details
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && !loading && (
                    <div className="py-12 text-center text-gray-500">
                        No users found matching your search.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-4 pt-6">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                    >
                        Previous
                    </button>
                    <span className="text-gray-400 text-sm">
                        Page <span className="text-white font-bold">{pagination.page}</span> of {pagination.pages}
                    </span>
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default UsersManager;
