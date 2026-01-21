import { useState } from "react";

export default function ReportPostModal({ isOpen, onClose, onSubmit, post }) {
  const [reason, setReason] = useState("Inappropriate Content");
  const [detail, setDetail] = useState("");

  if (!isOpen) return null;

  const reasons = [
    "Inappropriate Content",
    "Spam",
    "Harassment",
    "False Information",
    "Violence",
  ];

  return (
    <>
      <div className="report-overlay">
        <div className="report-modal">
          {/* CLOSE */}
          <button className="report-close" onClick={onClose}>
            ✕
          </button>

          {/* HEADER */}
          <div className="report-header">
            <div>
              <h3>Report Post</h3>
              <p>Tell us why this post should be reviewed.</p>
            </div>
          </div>

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
            <p>Additional Details</p>
            <textarea
              placeholder="Please provide more context about your report..."
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <div className="report-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-submit"
              onClick={() =>
                onSubmit({
                  targetType: "POST",
                  postId: post?.id,
                  reason,
                  detail,
                })
              }
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>

      {/* ===== CSS INLINE ===== */}
      <style>{`
        .report-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .report-modal {
          width: 360px;
          background: linear-gradient(180deg, #3a2718, #1e140d);
          border-radius: 18px;
          padding: 22px;
          color: #fff;
          position: relative;
          box-shadow: 0 25px 60px rgba(0,0,0,0.8);
          font-family: "Segoe UI", sans-serif;
        }

        .report-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: none;
          border: none;
          color: #bbb;
          font-size: 18px;
          cursor: pointer;
        }

        .report-header h3 {
          font-size: 15px;
          font-weight: 600;
        }

        .report-header p {
          font-size: 12px;
          color: #c7b9ae;
          margin-top: 4px;
        }

        .report-options {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .report-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          cursor: pointer;
          transition: background 0.2s;
        }

        .report-option:hover {
          background: rgba(255,255,255,0.08);
        }

        .report-option input {
          accent-color: #ff7a1a;
        }

        .report-option span {
          font-size: 13px;
        }

        .report-option.active {
          background: rgba(255,122,26,0.15);
        }

        .report-details {
          margin-top: 16px;
        }

        .report-details p {
          font-size: 12px;
          color: #c7b9ae;
          margin-bottom: 6px;
        }

        .report-details textarea {
          width: 100%;
          height: 70px;
          resize: none;
          border-radius: 12px;
          padding: 10px;
          background: rgba(255,255,255,0.06);
          border: none;
          color: #fff;
          font-size: 12px;
          outline: none;
        }

        .report-details textarea::placeholder {
          color: #b8a99c;
        }

        .report-actions {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }

        .btn-cancel {
          flex: 1;
          background: transparent;
          border: none;
          color: #d0c4ba;
          padding: 10px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
        }

        .btn-submit {
          flex: 1;
          background: linear-gradient(135deg, #ff8a2a, #ff6a00);
          border: none;
          color: #231810;
          font-weight: 600;
          padding: 10px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
        }

        .btn-submit:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
}


// const [showReportPost, setShowReportPost] = useState(false);

// <ReportPostModal
//   isOpen={showReportPost}
//   onClose={() => setShowReportPost(false)}
//   post={{ id: 123 }}
//   onSubmit={(data) => {
//     console.log("REPORT POST:", data);
//     setShowReportPost(false);
//   }}
// />
