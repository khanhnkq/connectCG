import { useState, useEffect } from "react";
import "./style/report-modal.css";

export default function ReportModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle,
  question,
  reasons,
  targetPayload,
  user, // optional (dùng cho report user)
}) {
  const [reason, setReason] = useState(reasons?.[0] || "");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason(reasons?.[0] || "");
      setDetail("");
    }
  }, [isOpen, reasons]);

  if (!isOpen) return null;

  return (
    <div className="report-overlay">
      <div className="report-modal">
        {/* CLOSE */}
        <button className="report-close" onClick={onClose}>
          ✕
        </button>

        {/* HEADER */}
        <div className="report-header">
          {user?.avatar && <img src={user.avatar} alt="" />}
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>

        {/* QUESTION */}
        {question && <p className="report-question">{question}</p>}

        {/* OPTIONS */}
        <div className="report-options">
          {reasons.map((r) => (
            <label
              key={r}
              className={`report-option ${reason === r ? "active" : ""}`}
            >
              <input
                type="radio"
                checked={reason === r}
                onChange={() => setReason(r)}
              />
              <span>{r}</span>
            </label>
          ))}
        </div>

        {/* DETAILS */}
        <div className="report-details">
          <p>Thông tin bổ sung</p>
          <textarea
            placeholder="Vui lòng cung cấp thêm thông tin..."
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </div>

        {/* ACTIONS */}
        <div className="report-actions">
          <button className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button
            className="btn-submit"
            onClick={() =>
              onSubmit({
                ...targetPayload,
                reason,
                detail,
              })
            }
          >
            Gửi báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}
