import React, { useState } from 'react';
import AdminLayout from '../../components/layout-admin/AdminLayout';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';

const AdminMembersManager = () => {
    // 1. Initial State with Roles
    const [members, setMembers] = useState([
        {
            id: "#US-9942",
            name: "Sarah Jenkins",
            username: "@sarah_j",
            email: "s.jenkins@example.com",
            avatar: "https://i.pravatar.cc/150?u=sarah",
            status: "Active",
            role: "Member",
            tier: "VIP Gold",
            joinedDate: "Oct 24, 2023"
        },
        {
            id: "#US-9945",
            name: "Alex Rivera",
            username: "@arivera",
            email: "alex.r@example.com",
            avatar: "https://i.pravatar.cc/150?u=alex",
            status: "Active",
            role: "Member",
            tier: "Standard",
            joinedDate: "Nov 12, 2023"
        },
        {
            id: "#US-9001",
            name: "Caleb Vance",
            username: "@cvance",
            email: "caleb.v@system.com",
            avatar: "https://ui-avatars.com/api/?name=Caleb+Vance&background=f47b25&color=fff",
            status: "Active",
            role: "Super Admin",
            tier: "System",
            joinedDate: "Jan 01, 2023"
        }
    ]);

    const [isShowingForm, setIsShowingForm] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });

    // 2. Validation Schema
    const memberSchema = Yup.object().shape({
        name: Yup.string().required("Full name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        role: Yup.string().required("Role is required"),
        tier: Yup.string().required()
    });

    // 3. Handlers
    const handleSubmit = (values, { resetForm }) => {
        const newMember = {
            id: `#US-${Math.floor(1000 + Math.random() * 9000)}`,
            name: values.name,
            username: `@${values.name.toLowerCase().replace(/\s/g, '_')}`,
            email: values.email,
            avatar: `https://i.pravatar.cc/150?u=${values.name}`,
            status: "Active",
            role: values.role,
            tier: values.tier,
            joinedDate: new Date().toLocaleDateString()
        };
        setMembers([newMember, ...members]);
        toast.success(`User registered as ${values.role}!`);
        setIsShowingForm(false);
        resetForm();
    };

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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight text-glow">Identity & Access</h2>
                        <p className="text-text-muted text-sm font-medium">Manage global permissions, roles, and member status</p>
                    </div>
                    <button onClick={() => setIsShowingForm(!isShowingForm)} className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined">{isShowingForm ? 'close' : 'person_add'}</span>
                        {isShowingForm ? 'Cancel Operation' : 'Provision New User'}
                    </button>
                </div>

                {/* Provisioning Form */}
                {isShowingForm && (
                    <div className="bg-surface-dark/40 p-8 rounded-3xl border border-primary/20 animate-in slide-in-from-top-4 duration-300">
                        <Formik initialValues={{ name: '', email: '', role: 'Member', tier: 'Standard' }} validationSchema={memberSchema} onSubmit={handleSubmit}>
                            {() => (
                                <Form className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Identity Name</label>
                                        <Field name="name" className="w-full bg-background-dark/50 border border-border-dark/50 rounded-xl py-3 px-4 text-white focus:border-primary outline-none transition-all" placeholder="Enter full name" />
                                        <ErrorMessage name="name" component="div" className="text-red-400 text-[10px] font-bold mt-1" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">System Role</label>
                                        <Field as="select" name="role" className="w-full bg-background-dark/50 border border-border-dark/50 rounded-xl py-3 px-4 text-white focus:border-primary outline-none">
                                            <option value="Member">Normal Member</option>
                                            <option value="Super Admin">System Admin</option>
                                        </Field>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Subscription</label>
                                        <Field as="select" name="tier" className="w-full bg-background-dark/50 border border-border-dark/50 rounded-xl py-3 px-4 text-white focus:border-primary outline-none">
                                            <option value="Standard">Standard</option>
                                            <option value="VIP Gold">VIP Gold</option>
                                            <option value="VIP Platinum">VIP Platinum</option>
                                        </Field>
                                    </div>
                                    <div className="flex items-end">
                                        <button type="submit" className="w-full bg-primary text-white font-black py-3.5 rounded-xl shadow-lg hover:brightness-110 transition-all">Authorize User</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-surface-dark/20 rounded-2xl border border-border-dark/50 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-background-dark/60 border-b border-border-dark/50 text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
                            <tr>
                                <th className="px-6 py-5">UID</th>
                                <th className="px-6 py-5">Profile</th>
                                <th className="px-6 py-5">Role / Authority</th>
                                <th className="px-6 py-5">Account Status</th>
                                <th className="px-6 py-5">Tier</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark/30 text-sm">
                            {members.map(member => (
                                <tr key={member.id} className="hover:bg-surface-dark/40 transition-colors text-white/90 group">
                                    <td className="px-6 py-5 font-mono text-[10px] text-text-muted">{member.id}</td>
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
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold text-text-muted">{member.tier}</span>
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
