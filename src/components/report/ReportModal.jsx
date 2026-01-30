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

      // Check Ban Status immediately
      const banUntil = parseInt(localStorage.getItem('report_ban_until') || '0');
      if (Date.now() < banUntil) {
        const minutesLeft = Math.ceil((banUntil - Date.now()) / 60000);
        toast.error(`Tính năng báo cáo đang bị khóa tạm thời (${minutesLeft} phút).`, { icon: '🔒' });
        onClose();
      }
    }
  }, [isOpen, reasons]);

  if (!isOpen) return null;

  // SPAM DETECTION CONSTANTS
  const SPAM_WINDOW = 60 * 1000; // 1 minute
  const WARNING_THRESHOLD = 5;
  const BAN_THRESHOLD = 10;
  const BAN_DURATION = 10 * 60 * 1000; // 10 minutes

  const checkSpamStatus = () => {
    const now = Date.now();
    const banUntil = parseInt(localStorage.getItem('report_ban_until') || '0');

    if (now < banUntil) {
      const minutesLeft = Math.ceil((banUntil - now) / 60000);
      return { allowed: false, reason: `Bạn đã bị tạm khóa tính năng báo cáo trong ${minutesLeft} phút do spam.` };
    }

    const history = JSON.parse(localStorage.getItem('report_history') || '[]')
      .filter(t => now - t < SPAM_WINDOW); // Keep only recent reports

    localStorage.setItem('report_history', JSON.stringify(history));

    return { allowed: true, count: history.length };
  };

  const handleSubmit = async () => {
    // 1. SPAM CHECK
    const status = checkSpamStatus();

    if (!status.allowed) {
      toast.error(status.reason, { duration: 4000, icon: '🚫' });
      onClose(); // Close modal if banned
      return;
    }

    if (status.count >= BAN_THRESHOLD) {
      localStorage.setItem('report_ban_until', (Date.now() + BAN_DURATION).toString());
      toast.error("Bạn đã gửi quá nhiều báo cáo! Tính năng này sẽ bị khóa trong 10 phút.", { duration: 5000, icon: '🔒' });
      onClose();
      return;
    }

    if (status.count >= WARNING_THRESHOLD) {
      toast("Bạn đang gửi báo cáo quá nhanh. Hãy kiểm tra kỹ trước khi gửi!", {
        icon: '⚠️',
        style: { background: '#f59e0b', color: '#fff' }
      });
    }

    // 2. VALIDATION
    if (reason === "Khác" && !detail.trim()) {
      toast.error("Vui lòng mô tả chi tiết!");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...targetPayload,
        reason: detail ? `${reason} | ${detail}` : reason,
      });

      // 3. RECORD SUCCESS
      const history = JSON.parse(localStorage.getItem('report_history') || '[]');
      history.push(Date.now());
      localStorage.setItem('report_history', JSON.stringify(history));

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
                ${reason === r
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
