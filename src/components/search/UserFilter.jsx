import React from 'react';
import CitySelect from '../common/CitySelect';

const UserFilter = ({
    keyword,
    setKeyword,
    cityCode,
    setCityCode,
    maritalStatus,
    setMaritalStatus,
    lookingFor,
    setLookingFor,
    onReset
}) => {
    return (
        <div className="bg-[#2a1d15] p-5 rounded-2xl border border-[#3e2b1d] shadow-lg flex flex-col xl:flex-row gap-4">
            {/* Keyword */}
            <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined">search</span>
                <input
                    className="w-full h-12 bg-[#1c120d] border border-[#493222] rounded-xl pl-11 pr-4 text-white placeholder-text-secondary/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="Tìm theo tên..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {/* City Select */}
            <div className="flex-1">
                <CitySelect
                    label=""
                    value={cityCode ? { code: cityCode, name: '' } : null}
                    onChange={(city) => {
                        setCityCode(city.code);
                    }}
                    error={null}
                />
            </div>

            {/* Marital Status */}
            <div className="relative group flex-1">
                <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full h-12 bg-[#1c120d] border border-[#493222] rounded-xl px-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer transition-all"
                >
                    <option value="">Hôn nhân (Tất cả)</option>
                    <option value="SINGLE">Độc thân</option>
                    <option value="MARRIED">Đã kết hôn</option>
                    <option value="DIVORCED">Đã ly hôn</option>
                    <option value="WIDOWED">Góa</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none material-symbols-outlined transition-transform group-hover:text-primary">
                    expand_more
                </span>
            </div>

            {/* Looking For */}
            <div className="relative group flex-1">
                <select
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                    className="w-full h-12 bg-[#1c120d] border border-[#493222] rounded-xl px-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer transition-all"
                >
                    <option value="">Mục đích (Tất cả)</option>
                    <option value="love">Tìm tình yêu</option>
                    <option value="friends">Kết bạn</option>
                    <option value="networking">Kết nối</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none material-symbols-outlined transition-transform group-hover:text-primary">
                    expand_more
                </span>
            </div>

            {/* Reset Button */}
            <button
                onClick={onReset}
                className="h-12 px-6 rounded-xl bg-[#3a2b22] hover:bg-[#493222] text-white font-bold border border-[#493222] transition-all flex items-center justify-center gap-2 whitespace-nowrap min-w-fit hover:text-primary"
                title="Đặt lại bộ lọc"
            >
                <span className="material-symbols-outlined">restart_alt</span>
                <span className="hidden xl:inline">Đặt lại</span>
            </button>
        </div>
    );
};

export default UserFilter;
