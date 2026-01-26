import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ReportModal({
                                      isOpen,
                                      onClose,
                                      onSubmit,
                                      title,
                                      subtitle,
                                      question,
                                      reasons = [],
                                      targetPayload,
                                      user,
                                    }) {
  const [reason, setReason] = useState(reasons[0] || "");
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason(reasons[0] || "");
      setDetail("");
      setSubmitting(false);
    }
  }, [isOpen, reasons]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // validate khi chọn "Khác"
    if (reason === "Khác" && !detail.trim()) {
      toast.error("Vui lòng mô tả chi tiết!")
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...targetPayload,
        reason: detail ? `${reason} | ${detail}` : reason,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75">
        <div className="relative w-[360px] rounded-[18px] bg-gradient-to-b from-[#3a2718] to-[#1e140d] p-[22px] text-white shadow-[0_25px_60px_rgba(0,0,0,0.8)] font-sans">

          {/* CLOSE */}
          <button
              onClick={onClose}
              disabled={submitting}
              className="absolute right-3 top-3 text-lg text-neutral-400 hover:text-white disabled:opacity-50"
          >
            ✕
          </button>

          {/* HEADER */}
          <div className="mb-4 flex gap-3">
            {user?.avatar && (
                <img
                    src={user.avatar}
                    alt=""
                    className="h-[42px] w-[42px] rounded-full object-cover"
                />
            )}
            <div>
              <h3 className="text-[15px] font-semibold">{title}</h3>
              {subtitle && (
                  <p className="mt-1 text-[12px] text-[#c7b9ae]">{subtitle}</p>
              )}
            </div>
          </div>

          {/* QUESTION */}
          {question && (
              <p className="mb-2 text-[13px]">{question}</p>
          )}

          {/* OPTIONS */}
          <div className="mt-4 flex flex-col gap-2.5">
            {reasons.map((r) => (
                <label
                    key={r}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl p-3 transition
                ${
                        reason === r
                            ? "bg-orange-500/20"
                            : "bg-white/5 hover:bg-white/10"
                    }`}
                >
                  <input
                      type="radio"
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-orange-500"
                  />
                  <span className="text-[13px]">{r}</span>
                </label>
            ))}
          </div>

          {/* DETAILS */}
          <div className="mt-4">
            <p className="mb-1.5 text-[12px] text-[#c7b9ae]">
              Thông tin bổ sung
            </p>
            <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Vui lòng cung cấp thêm thông tin..."
                className="h-[70px] w-full resize-none rounded-xl bg-white/5 p-2.5 text-[12px] text-white outline-none placeholder:text-[#b8a99c]"
            />
          </div>

          {/* ACTIONS */}
          <div className="mt-[18px] flex gap-2.5">
            <button
                onClick={onClose}
                disabled={submitting}
                className="flex-1 rounded-full px-3 py-2.5 text-[13px] text-[#d0c4ba] hover:bg-white/5 disabled:opacity-50"
            >
              Hủy
            </button>

            <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 rounded-full bg-gradient-to-br from-[#ff8a2a] to-[#ff6a00] px-3 py-2.5 text-[13px] font-semibold text-[#231810] hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Đang gửi..." : "Gửi báo cáo"}
            </button>
          </div>
        </div>
      </div>
  );
}
