import React, { useState } from 'react';
import AdminLayout from '../../components/layout-admin/AdminLayout';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { findAllGroup } from "../../services/groups/GroupService.js";

const AdminGroupsManager = () => {
    // 1. Initial State with Owners
    const [groups, setGroups] = useState([]);
    const [isReloading, setIsReloading] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
    const [selectedGroupReports, setSelectedGroupReports] = useState(null);

    // Mock report data added to the second group
    useState(() => {
        const fetchData = async () => {
            const list = await findAllGroup();
            setGroups(list);
        };
        fetchData();
    }, []);

    const handleDeactivate = (id, name) => {
        setConfirmConfig({
            isOpen: true,
            title: "Deactivate Community?",
            message: `You are about to deactivate "${name}". This will hide the group from the public newsfeed and restrict new memberships.`,
            onConfirm: () => {
                setGroups(groups.filter(g => g.id !== id));
                toast.error("Community group has been de-indexed");
                setConfirmConfig({ ...confirmConfig, isOpen: false });
            }
        });
    };

    return (
        <AdminLayout title="Community Supervision" activeTab="Groups" brandName="Social Admin">
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Community Oversight</h2>
                        <p className="text-text-muted text-sm font-medium">Monitoring group health, ownership, and platform alignment</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-surface-dark border border-border-dark/50 px-6 py-3 rounded-2xl flex items-center gap-3">
                            <span className="material-symbols-outlined text-orange-400">report_problem</span>
                            <div>
                                <p className="text-[10px] font-black text-text-muted uppercase leading-none">Global Reports</p>
                                <p className="text-lg font-black text-white">42</p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groups.map((group, index)=> (
                        <div key={group.id} className="bg-surface-dark border border-border-dark/50 rounded-3xl overflow-hidden group hover:border-primary/30 transition-all shadow-xl">
                            <div className="h-44 relative overflow-hidden">
                                <img
                                    src={group.image || `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt=""
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent opacity-80"></div>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border backdrop-blur-md ${group.privacy === 'public' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-orange-500/20 text-orange-400 border-orange-500/20'}`}>
                                        {group.privacy}
                                    </span>
                                    {group.is_deleted && (
                                        <span className="px-2.5 py-1 text-[9px] font-black uppercase rounded-lg bg-red-500 text-white border border-white/20">Deleted</span>
                                    )}
                                </div>
                                <div className="absolute bottom-4 left-6 flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/60 font-black uppercase tracking-tighter leading-none">Owner</p>
                                        <p className="text-xs text-white font-bold">{group.ownerName}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xl font-black text-white group-hover:text-primary transition-colors">{group.name}</h4>
                                    </div>
                                    <p className="text-xs text-white/70 line-clamp-2 mt-2">{group.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-background-dark/30 p-3 rounded-2xl border border-border-dark/30">
                                        <p className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-none mb-1">Created At</p>
                                        <p className="text-[11px] text-white font-black">{group.createdAt ? new Date(group.createdAt).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div className="bg-background-dark/30 p-3 rounded-2xl border border-border-dark/30">
                                        <p className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-none mb-1">Media Reference</p>
                                        <p className="text-[11px] text-white font-black">{group.cover_media_id || 'None'}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border-dark/30 flex justify-end items-center">
                                    <div className="flex gap-2">
                                        <button className="p-2.5 hover:bg-background-dark rounded-xl text-text-muted hover:text-white transition-all border border-transparent hover:border-border-dark" title="Edit Group">
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <button onClick={() => handleDeactivate(group.id, group.name)} className="p-2.5 hover:bg-red-500/10 rounded-xl text-text-muted hover:text-red-400 transition-all" title="Delete Group">
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Shared Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type="danger"
                onConfirm={confirmConfig.onConfirm}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                confirmText="Confirm Action"
            />

            {/* Detailed Reports Modal */}
            {selectedGroupReports && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-background-dark/95 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-surface-dark w-full max-w-2xl rounded-[2.5rem] border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-2xl font-black text-white">{selectedGroupReports.name}</h4>
                                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded">INCIDENT LOG</span>
                                    </div>
                                    <p className="text-text-muted text-sm font-medium">Reviewing {selectedGroupReports.reports} community-flagged violations</p>
                                </div>
                                <button onClick={() => setSelectedGroupReports(null)} className="size-10 rounded-full bg-background-dark flex items-center justify-center text-text-muted hover:text-white transition-all border border-border-dark/50">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                {(selectedGroupReports.reportHistory || []).map((report) => (
                                    <div key={report.id} className="bg-background-dark/40 p-5 rounded-3xl border border-border-dark/30 flex justify-between items-center group/item hover:border-red-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400">
                                                <span className="material-symbols-outlined">gavel</span>
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">{report.reason}</p>
                                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-tighter">Reported by {report.reporter} • {report.date}</p>
                                            </div>
                                        </div>
                                        <button className="opacity-0 group-hover/item:opacity-100 px-3 py-1.5 rounded-lg text-[10px] font-black text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all uppercase">Inspect Post</button>
                                    </div>
                                ))}
                                {(!selectedGroupReports.reportHistory || selectedGroupReports.reportHistory.length === 0) && (
                                    <div className="text-center py-10 space-y-3">
                                        <span className="material-symbols-outlined text-4xl text-text-muted/30">task_alt</span>
                                        <p className="text-text-muted text-sm font-bold uppercase tracking-widest">No active incident logs found</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button
                                    onClick={() => setSelectedGroupReports(null)}
                                    className="py-4 rounded-2xl border border-border-dark/50 text-text-muted font-bold hover:bg-background-dark hover:text-white transition-all"
                                >
                                    Dismiss Investigation
                                </button>
                                <button
                                    onClick={() => {
                                        const groupToDeactivate = selectedGroupReports;
                                        setSelectedGroupReports(null);
                                        handleDeactivate(groupToDeactivate.id, groupToDeactivate.name);
                                    }}
                                    className="py-4 rounded-2xl bg-red-500 text-white font-black shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">block</span>
                                    Confirm Group Ban
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminGroupsManager;
