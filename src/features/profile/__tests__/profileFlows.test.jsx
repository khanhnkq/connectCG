import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

import { BasicInfoFlow } from "../flows/BasicInfoFlow";
import { CareerEducationFlow } from "../flows/CareerEducationFlow";
import { SocialLocationFlow } from "../flows/SocialLocationFlow";
import { MediaCropFlow } from "../flows/MediaCropFlow";
import ProfileEditModal from "../components/ProfileEditModal";
import ProfilePage from "../ProfilePage";
import authReducer from "../../../redux/slices/authSlice";
import userReducer from "../../../redux/slices/userSlice";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn().mockReturnValue("toast-id"),
  },
}));

vi.mock("../../../services/CityService", () => ({
  default: {
    getAllCities: vi.fn().mockResolvedValue([
      { code: "HN", name: "Hà Nội" },
      { code: "HCM", name: "Hồ Chí Minh" },
      { code: "DN", name: "Đà Nẵng" },
    ]),
  },
}));

vi.mock("../../../services/user/UserProfileService", () => ({
  default: {
    getUserProfile: vi.fn().mockResolvedValue({
      data: {
        userId: "1",
        fullName: "Test User",
        relationshipStatus: "SELF",
      },
    }),
    updateProfileInfo: vi.fn().mockResolvedValue({ success: true }),
    updateAvatar: vi.fn().mockResolvedValue({ success: true }),
    updateCover: vi.fn().mockResolvedValue({ success: true }),
  },
}));

vi.mock("../../../services/PostService", () => ({
  default: {
    getPostsByUserId: vi.fn().mockResolvedValue({ data: [] }),
    deletePost: vi.fn().mockResolvedValue({ success: true }),
    updatePost: vi.fn().mockResolvedValue({ success: true }),
  },
}));

vi.mock("../../../utils/uploadImage", () => ({
  uploadAvatar: vi.fn().mockResolvedValue("https://example.com/new-avatar.jpg"),
  uploadCover: vi.fn().mockResolvedValue("https://example.com/new-cover.jpg"),
}));

describe("PR #26: Profile Multi-Flow UX Components", () => {
  const mockProfile = {
    userId: 1,
    fullName: "Nguyễn Văn A",
    bio: "Lập trình viên đam mê công nghệ",
    occupation: "Kỹ sư phần mềm",
    maritalStatus: "SINGLE",
    lookingFor: "NETWORKING",
    gender: "MALE",
    dateOfBirth: "1995-10-20",
    cityCode: "HN",
    cityName: "Hà Nội",
    currentAvatarUrl: "https://example.com/avatar.jpg",
    currentCoverUrl: "https://example.com/cover.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-image-url");
    window.URL.revokeObjectURL = vi.fn();

    // Mock HTMLCanvasElement methods
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      save: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      drawImage: vi.fn(),
      restore: vi.fn(),
    });
    HTMLCanvasElement.prototype.toBlob = vi.fn().mockImplementation((cb) => {
      cb(new Blob(["mock-image-data"], { type: "image/jpeg" }));
    });
  });

  describe("BasicInfoFlow", () => {
    it("renders form inputs with initial profile values and submits updated data", async () => {
      const handleSave = vi.fn();
      render(<BasicInfoFlow profile={mockProfile} onSave={handleSave} />);

      expect(screen.getByDisplayValue("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.getByDisplayValue("1995-10-20")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Lập trình viên đam mê công nghệ")).toBeInTheDocument();

      // Change full name
      const nameInput = screen.getByDisplayValue("Nguyễn Văn A");
      fireEvent.change(nameInput, { target: { value: "Nguyễn Văn B" } });

      // Click save
      const submitBtn = screen.getByRole("button", { name: "Lưu thông tin cơ bản" });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(handleSave).toHaveBeenCalledWith(
          expect.objectContaining({
            fullName: "Nguyễn Văn B",
            gender: "MALE",
          })
        );
      });
    });

    it("displays validation error when full name is empty", async () => {
      const handleSave = vi.fn();
      render(<BasicInfoFlow profile={mockProfile} onSave={handleSave} />);

      const nameInput = screen.getByDisplayValue("Nguyễn Văn A");
      fireEvent.change(nameInput, { target: { value: "" } });
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(screen.getByText("Họ và tên không được để trống")).toBeInTheDocument();
      });
      expect(handleSave).not.toHaveBeenCalled();
    });
  });

  describe("CareerEducationFlow", () => {
    it("renders occupation input and allows selecting quick career suggestion", async () => {
      const handleSave = vi.fn();
      render(<CareerEducationFlow profile={mockProfile} onSave={handleSave} />);

      expect(screen.getByDisplayValue("Kỹ sư phần mềm")).toBeInTheDocument();

      // Click on quick suggestion
      const suggestionBtn = screen.getByRole("button", { name: "Thiết kế UI/UX" });
      fireEvent.click(suggestionBtn);

      expect(screen.getByDisplayValue("Thiết kế UI/UX")).toBeInTheDocument();

      // Submit
      const submitBtn = screen.getByRole("button", { name: "Lưu nghề nghiệp" });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(handleSave).toHaveBeenCalledWith({
          occupation: "Thiết kế UI/UX",
        });
      });
    });
  });

  describe("SocialLocationFlow", () => {
    it("renders city combobox and purpose options, submits updated goal", async () => {
      const handleSave = vi.fn();
      render(<SocialLocationFlow profile={mockProfile} onSave={handleSave} />);

      expect(screen.getByText("Vị trí & Định hướng kết nối")).toBeInTheDocument();

      // Select another purpose card: "Kết bạn mới"
      const friendsOption = screen.getByText("Kết bạn mới");
      fireEvent.click(friendsOption);

      const submitBtn = screen.getByRole("button", { name: "Lưu vị trí & định hướng" });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(handleSave).toHaveBeenCalledWith(
          expect.objectContaining({
            lookingFor: "FRIENDS",
          })
        );
      });
    });
  });

  describe("MediaCropFlow", () => {
    it("switches between Avatar (1:1) and Cover tabs", () => {
      render(
        <MediaCropFlow
          profile={mockProfile}
          onAvatarUpload={vi.fn()}
          onCoverUpload={vi.fn()}
        />
      );

      expect(screen.getByText("Ảnh đại diện (1:1)")).toBeInTheDocument();
      expect(screen.getByText("Ảnh bìa (16:9 / Rộng)")).toBeInTheDocument();

      // Switch to cover
      fireEvent.click(screen.getByText("Ảnh bìa (16:9 / Rộng)"));
      expect(screen.getByText("Ảnh bìa (16:9 / Rộng)")).toHaveClass("text-primary");
    });

    it("handles file selection, rotation, and upload trigger", async () => {
      const handleAvatarUpload = vi.fn();
      const { container } = render(
        <MediaCropFlow
          profile={mockProfile}
          onAvatarUpload={handleAvatarUpload}
          onCoverUpload={vi.fn()}
        />
      );

      const file = new File(["dummy content"], "avatar.png", { type: "image/png" });
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("Phóng to")).toBeInTheDocument();
      });

      // Rotate image
      const rotateBtn = screen.getByRole("button", { name: "Xoay 90°" });
      fireEvent.click(rotateBtn);

      // Apply upload
      const uploadBtn = screen.getByRole("button", { name: "Cập nhật ảnh đại diện" });
      fireEvent.click(uploadBtn);

      await waitFor(() => {
        expect(handleAvatarUpload).toHaveBeenCalled();
      });
    });
  });

  describe("ProfileEditModal Orchestrator", () => {
    let store;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          auth: authReducer,
          user: userReducer,
        },
        preloadedState: {
          auth: { user: { id: 1 }, isAuthenticated: true },
          user: { profile: mockProfile },
        },
      });
    });

    it("renders modal when open and allows navigating through all 4 flows", () => {
      render(
        <Provider store={store}>
          <ProfileEditModal
            isOpen={true}
            onClose={vi.fn()}
            profile={mockProfile}
            initialFlow="basic"
          />
        </Provider>
      );

      expect(screen.getByText("Chỉnh sửa thông tin hồ sơ")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /^Thông tin cơ bản$/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /^Nghề nghiệp & Học vấn$/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /^Vị trí & Định hướng$/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /^Ảnh đại diện & Bìa$/i })).toBeInTheDocument();

      // Navigate to Career Flow
      fireEvent.click(screen.getByRole("button", { name: /^Nghề nghiệp & Học vấn$/i }));
      expect(screen.getByText("Mẹo mở rộng quan hệ")).toBeInTheDocument();

      // Navigate to Location Flow
      fireEvent.click(screen.getByRole("button", { name: /^Vị trí & Định hướng$/i }));
      expect(screen.getByText("Mục đích tham gia cộng đồng")).toBeInTheDocument();

      // Navigate to Media Flow
      fireEvent.click(screen.getByRole("button", { name: /^Ảnh đại diện & Bìa$/i }));
      expect(screen.getByText("Ảnh đại diện (1:1)")).toBeInTheDocument();
    });

    it("supports opening directly to initialFlow='media'", () => {
      render(
        <Provider store={store}>
          <ProfileEditModal
            isOpen={true}
            onClose={vi.fn()}
            profile={mockProfile}
            initialFlow="media"
          />
        </Provider>
      );

      expect(screen.getByText("Ảnh đại diện (1:1)")).toBeInTheDocument();
    });
  });

  describe("ProfilePage URL Tab Synchronization", () => {
    let store;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          auth: authReducer,
          user: userReducer,
        },
        preloadedState: {
          auth: { user: { id: 1 }, isAuthenticated: true },
          user: { profile: mockProfile, loading: false },
        },
      });
    });

    it("synchronizes active tab with URL query parameter ?tab=about", async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/dashboard/my-profile?tab=about"]}>
            <ProfilePage mode="self" />
          </MemoryRouter>
        </Provider>
      );

      // When ?tab=about is present in URL, ProfileAbout should be rendered
      await waitFor(() => {
        expect(screen.getByText("Giới thiệu")).toBeInTheDocument();
      });
    });
  });
});
