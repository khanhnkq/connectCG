import React from "react";
import { X, UserMinus as UserX, Check, UserPlus } from "@phosphor-icons/react";

const InviteMemberModal = ({
  show,
  onClose,
  friends,
  selectedInvitees,
  onToggleInvitee,
  onInvite,
  isLoading,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-main w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-0">
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-main">
            Mời bạn bè vào nhóm
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="size-8 rounded-full bg-surface-subtle text-text-main flex items-center justify-center hover:bg-surface-subtle/80 transition-all border-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 -mr-2">
          {friends.length === 0 ? (
            <div className="text-center py-10 text-text-secondary">
              <UserX size={48} className="mx-auto mb-3 opacity-30" />
              <p>Không có bạn bè nào để mời</p>
              <p className="text-sm mt-1">Tất cả bạn bè đã có trong nhóm</p>
            </div>
          ) : (
            <div className={`space-y-2 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
              {friends.map((friend) => {
                const isSelected = selectedInvitees.some(
                  (f) => f.id === friend.id,
                );
                return (
                  <div
                    key={friend.id}
                    onClick={() => !isLoading && onToggleInvitee(friend)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-0 ${isSelected
                        ? "bg-primary/10 text-primary"
                        : "bg-surface-subtle hover:bg-surface-subtle/80 text-text-main"
                      }`}
                  >
                    <div
                      className="size-10 rounded-full bg-cover bg-center flex-shrink-0"
                      style={{
                        backgroundImage: `url("${friend.avatarUrl ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }")`,
                      }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-main font-bold truncate">
                        {friend.fullName}
                      </p>
                    </div>
                    <div
                      className={`size-5 rounded flex items-center justify-center transition-all ${isSelected
                          ? "bg-primary text-[#231810]"
                          : "bg-surface-main"
                        }`}
                    >
                      {isSelected && (
                        <Check size={16} className="text-[#231810]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {friends.length > 0 && (
          <div className="p-6">
            <button
              onClick={onInvite}
              disabled={selectedInvitees.length === 0 || isLoading}
              className="w-full py-3 bg-primary hover:bg-orange-600 text-[#231810] font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="size-5 border-2 border-[#231810] border-t-transparent rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  {selectedInvitees.length > 0
                    ? `Mời ${selectedInvitees.length} người`
                    : "Chọn bạn bè để mời"}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteMemberModal;
