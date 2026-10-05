import { describe, it, expect, vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AuthSplitLayout from "../components/AuthSplitLayout";
import AccountLockedDialog from "../components/AccountLockedDialog";
import TermsModal from "../components/TermsModal";
import SocialLoginButtons from "../components/SocialLoginButtons";

describe("Auth Feature Components", () => {
  describe("<AuthSplitLayout />", () => {
    it("renders title, subtitle, and children correctly", () => {
      render(
        <MemoryRouter>
          <AuthSplitLayout
            title="Đăng nhập tài khoản"
            subtitle="Vui lòng nhập thông tin"
            heroTitle="Slogan kiểm thử"
          >
            <div data-testid="auth-child">Nội dung form con</div>
          </AuthSplitLayout>
        </MemoryRouter>
      );

      expect(screen.getByText("Đăng nhập tài khoản")).toBeInTheDocument();
      expect(screen.getByText("Vui lòng nhập thông tin")).toBeInTheDocument();
      expect(screen.getByText("Slogan kiểm thử")).toBeInTheDocument();
      expect(screen.getByTestId("auth-child")).toBeInTheDocument();
    });

    it("renders back button when backTo is provided", () => {
      render(
        <MemoryRouter>
          <AuthSplitLayout title="Title" backTo="/login">
            <div>Form</div>
          </AuthSplitLayout>
        </MemoryRouter>
      );

      const backLinks = screen.getAllByRole("link", { name: /Quay lại/i });
      expect(backLinks.length).toBeGreaterThan(0);
      expect(backLinks[0]).toHaveAttribute("href", "/login");
    });
  });

  describe("<AccountLockedDialog />", () => {
    it("does not render when isOpen is false", () => {
      const { container } = render(
        <AccountLockedDialog isOpen={false} onClose={() => {}} />
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders message and triggers onClose when clicked", () => {
      const handleClose = vi.fn();
      render(
        <AccountLockedDialog
          isOpen={true}
          message="Tài khoản bị tạm ngưng 24h"
          onClose={handleClose}
        />
      );

      expect(screen.getByText("Tài khoản bị khóa")).toBeInTheDocument();
      expect(screen.getByText("Tài khoản bị tạm ngưng 24h")).toBeInTheDocument();

      const button = screen.getByRole("button", { name: /Đã hiểu/i });
      fireEvent.click(button);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("<TermsModal />", () => {
    it("does not render when isOpen is false", () => {
      const { container } = render(
        <TermsModal isOpen={false} onClose={() => {}} />
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders terms of service headings and closes on click", () => {
      const handleClose = vi.fn();
      render(<TermsModal isOpen={true} onClose={handleClose} />);

      expect(screen.getByText("Điều khoản sử dụng")).toBeInTheDocument();
      expect(screen.getByText("1. Chấp nhận điều khoản")).toBeInTheDocument();
      expect(screen.getByText("2. Quyền và Trách nhiệm của Người dùng")).toBeInTheDocument();

      const understandButton = screen.getByRole("button", { name: /Đã hiểu/i });
      fireEvent.click(understandButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("<SocialLoginButtons />", () => {
    it("renders Facebook and Google login links", () => {
      render(<SocialLoginButtons />);

      const facebookLink = screen.getByRole("link", { name: /Facebook/i });
      const googleLink = screen.getByRole("link", { name: /Google/i });

      expect(facebookLink).toBeInTheDocument();
      expect(googleLink).toBeInTheDocument();
      expect(facebookLink).toHaveAttribute("href");
      expect(googleLink).toHaveAttribute("href");
    });
  });
});
