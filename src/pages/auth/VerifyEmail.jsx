import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle,
  WarningCircle,
  CircleNotch,
} from "@phosphor-icons/react";

import authService from "../../services/authService";
import { Card } from "../../components/ui/card/Card";
import { Button } from "../../components/ui/button/Button";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [status, setStatus] = useState(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token ? "" : "Không tìm thấy mã xác thực (token)."
  );
  const verifyCalled = useRef(false);

  useEffect(() => {
    if (!token) return;

    if (verifyCalled.current) return;
    verifyCalled.current = true;

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus("success");
        setMessage(
          "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ."
        );
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Mã xác thực không hợp lệ hoặc đã hết hạn."
        );
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main p-6">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <CircleNotch className="size-12 text-primary animate-spin" />
            <h2 className="text-xl font-bold text-text-main">
              Đang xác thực email...
            </h2>
            <p className="text-sm text-text-secondary">
              Vui lòng đợi trong giây lát trong khi chúng tôi kích hoạt tài khoản của bạn.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="size-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center text-success">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-text-main">
              Xác thực thành công!
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {message}
            </p>
            <p className="text-xs text-text-muted">
              Đang tự động chuyển hướng đến trang đăng nhập sau 3 giây...
            </p>
            <Link to="/login" className="w-full pt-2">
              <Button variant="primary" size="lg" className="w-full">
                Đăng nhập ngay
              </Button>
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="size-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
              <WarningCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-text-main">
              Xác thực thất bại
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {message}
            </p>
            <Link to="/login" className="w-full pt-2">
              <Button variant="primary" size="lg" className="w-full">
                Quay lại trang Đăng nhập
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
