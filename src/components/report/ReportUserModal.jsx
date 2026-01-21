import { useState } from "react";

export default function ReportUserModal({ isOpen, onClose, onSubmit, user }) {
  const [reason, setReason] = useState("Spam or Scam");
  const [detail, setDetail] = useState("");

  if (!isOpen) return null;

  const reasons = [
    "Spam or Scam",
    "Harassment or Bullying",
    "Inappropriate Content",
    "Fake Account",
    "Other",
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-[999]">
        <div className="w-[360px] bg-gradient-to-b from-[#3a2718] to-[#1e140d] rounded-[18px] p-5 text-white relative shadow-[0_25px_60px_rgba(0,0,0,0.8)] font-sans">
          {/* CLOSE */}
          <button 
            className="absolute top-3.5 right-3.5 bg-transparent border-none text-[#bbb] text-lg cursor-pointer hover:text-white" 
            onClick={onClose}
          >
            ✕
          </button>

          {/* HEADER */}
          <div className="flex gap-3 mb-4">
            <img 
              src={user.avatar} 
              alt="" 
              className="w-[42px] h-[42px] rounded-full object-cover"
            />
            <div>
              <h3 className="text-sm font-semibold">Report {user.name}</h3>
              <p className="text-xs text-[#c7b9ae]">Help us understand what's happening</p>
            </div>
          </div>

          {/* QUESTION */}
          <p className="text-[13px] mb-2.5">
            Why are you reporting this user?
          </p>

          {/* OPTIONS */}
          <div className="flex flex-col gap-2.5">
            {reasons.map((r) => (
              <label
                key={r}
                className={`flex items-center gap-2.5 p-3 rounded-xl cursor-pointer transition-colors ${
                  reason === r 
                    ? "bg-[#ff7a1a]/15" 
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <input
                  type="radio"
                  className="accent-[#ff7a1a] cursor-pointer"
                  checked={reason === r}
                  onChange={() => setReason(r)}
                />
                <span className="text-[13px]">{r}</span>
              </label>
            ))}
          </div>

          {/* DETAILS */}
          <div className="mt-4">
            <p className="text-xs text-[#c7b9ae] mb-1.5">Additional Details</p>
            <textarea
              className="w-full h-[70px] resize-none rounded-xl p-2.5 bg-white/5 border-none text-white text-xs outline-none placeholder-[#b8a99c]"
              placeholder="Please provide any additional information that may help us investigate..."
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between gap-2.5 mt-[18px]">
            <button 
              className="flex-1 bg-transparent border-none text-[#d0c4ba] p-2.5 rounded-[20px] cursor-pointer text-[13px] hover:bg-white/5 transition-colors" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-gradient-to-br from-[#ff8a2a] to-[#ff6a00] border-none text-[#231810] font-semibold p-2.5 rounded-[20px] cursor-pointer text-[13px] hover:opacity-90"
              onClick={() => onSubmit({ reason, detail })}
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
