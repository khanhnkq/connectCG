import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout-admin/AdminLayout';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { getAllUsers } from '../../services/admin/AdminUserService';

const AdminMembersManager = () => {
    // 1. Initial State with Roles
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            const mappedMembers = data.map(user => ({
                id: user.userId,
                name: user.fullName || user.username,
                username: user.username,
                email: user.email,
                avatar: user.currentAvatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`,
                status: user.isLocked ? "Banned" : "Active",
                role: user.role,
                joinedDate: "N/A" // Placeholder
            }));
            setMembers(mappedMembers);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });




    const toggleStatus = (id, currentStatus) => {
        const action = currentStatus === "Active" ? "Ban" : "Unban";
        setConfirmConfig({
            isOpen: true,
            title: `${action} User Access?`,
            message: `Are you sure you want to ${action.toLowerCase()} this user? They will ${action === "Ban" ? "lose" : "regain"} access to the platform.`,
            type: action === "Ban" ? "danger" : "info",
            onConfirm: () => {
                setMembers(members.map(m => m.id === id ? { ...m, status: m.status === "Active" ? "Banned" : "Active" } : m));
                toast(`User successfully ${action.toLowerCase()}ned`, { icon: 'ℹ️' });
                setConfirmConfig({ ...confirmConfig, isOpen: false });
            }
        });
    };

    const handleDelete = (id, name) => {
        setConfirmConfig({
            isOpen: true,
            title: "Purge Identity?",
            message: `This will permanently delete ${name}'s account and all associated data. This action cannot be undone.`,
            type: "danger",
            onConfirm: () => {
                setMembers(members.filter(m => m.id !== id));
                toast.error("User identity purged from system");
                setConfirmConfig({ ...confirmConfig, isOpen: false });
            }
        });
    };

    return (
        <AdminLayout title="System User Control" activeTab="Users" brandName="Social Admin">
            <div className="p-8 space-y-8">
                {/* Users Table */}
                <div className="bg-surface-dark/20 rounded-2xl border border-border-dark/50 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-background-dark/60 border-b border-border-dark/50 text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
                            <tr>
                                <th className="px-6 py-5">STT</th>
                                <th className="px-6 py-5">Thông tin</th>
                                <th className="px-6 py-5">Vai trò</th>
                                <th className="px-6 py-5">Trạng thái</th>
                                <th className="px-6 py-5 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark/30 text-sm">
                            {members.map((member , index) => (
                                <tr key={member.id} className="hover:bg-surface-dark/40 transition-colors text-white/90 group">
                                    <td className="px-6 py-5 font-mono text-[10px] text-text-muted">{index + 1}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl overflow-hidden border border-border-dark/50 shrink-0 group-hover:border-primary/50 transition-all">
                                                <img src={member.avatar} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold truncate">{member.name}</p>
                                                <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">{member.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border flex items-center gap-1.5 w-fit ${member.role === 'Super Admin'
                                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                            }`}>
                                            <span className="material-symbols-outlined text-xs">
                                                {member.role === 'Super Admin' ? 'shield' : 'person'}
                                            </span>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${member.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right space-x-2">
                                        <button onClick={() => toggleStatus(member.id, member.status)} className="p-2 hover:bg-background-dark rounded-xl text-text-muted hover:text-orange-400 transition-all" title="Toggle Access">
                                            <span className="material-symbols-outlined text-lg">{member.status === 'Banned' ? 'verified_user' : 'block'}</span>
                                        </button>
                                        <button onClick={() => handleDelete(member.id, member.name)} className="p-2 hover:bg-red-500/10 rounded-xl text-text-muted hover:text-red-400 transition-all" title="Purge Identity">
                                            <span className="material-symbols-outlined text-lg">delete_sweep</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Shared Confirmation Modal */}
                <ConfirmModal
                    isOpen={confirmConfig.isOpen}
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    type={confirmConfig.type || 'danger'}
                    onConfirm={confirmConfig.onConfirm}
                    onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminMembersManager;
