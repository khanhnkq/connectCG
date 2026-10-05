import { describe, it, expect, vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import OnboardingStepper from "../components/OnboardingStepper";
import AvatarUploadField from "../components/AvatarUploadField";
import RadioPillGroup from "../components/RadioPillGroup";
import HobbiesSelector from "../components/HobbiesSelector";
import StepSuccessCelebration from "../components/steps/StepSuccessCelebration";

describe("Onboarding Feature Components", () => {
  describe("<OnboardingStepper />", () => {
    it("renders 3 steps and highlights the current step", () => {
      render(<OnboardingStepper activeStep={2} />);

      expect(screen.getByText("Danh tính")).toBeInTheDocument();
      expect(screen.getByText("Định hướng")).toBeInTheDocument();
      expect(screen.getByText("Sở thích")).toBeInTheDocument();
    });
  });

  describe("<AvatarUploadField />", () => {
    it("renders upload placeholder when no preview is provided", () => {
      render(<AvatarUploadField avatarPreview={null} onChange={() => {}} />);
      expect(screen.getByText("Tải ảnh lên")).toBeInTheDocument();
    });

    it("renders avatar preview image when previewUrl exists", () => {
      render(
        <AvatarUploadField
          avatarPreview="https://example.com/avatar.jpg"
          onChange={() => {}}
        />
      );
      const img = screen.getByAltText("Avatar preview");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    });
  });

  describe("<RadioPillGroup />", () => {
    const testOptions = [
      { value: "opt1", label: "Lựa chọn 1" },
      { value: "opt2", label: "Lựa chọn 2" },
    ];

    it("renders all options and calls onChange when clicked", () => {
      const handleChange = vi.fn();
      render(
        <RadioPillGroup
          label="Tiêu đề câu hỏi"
          options={testOptions}
          value="opt1"
          onChange={handleChange}
        />
      );

      expect(screen.getByText("Tiêu đề câu hỏi")).toBeInTheDocument();
      expect(screen.getByText("Lựa chọn 1")).toBeInTheDocument();
      expect(screen.getByText("Lựa chọn 2")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Lựa chọn 2"));
      expect(handleChange).toHaveBeenCalledWith("opt2");
    });
  });

  describe("<HobbiesSelector />", () => {
    it("renders hobbies list and shows selected count", () => {
      const handleChange = vi.fn();
      render(
        <HobbiesSelector
          selectedHobbies={[1, 2]}
          onChange={handleChange}
        />
      );

      expect(screen.getByText("Đã chọn: 2")).toBeInTheDocument();
      expect(screen.getByText("Âm nhạc")).toBeInTheDocument();
      expect(screen.getByText("Thể thao")).toBeInTheDocument();

      // Click on a hobby to toggle
      fireEvent.click(screen.getByText("Đọc sách"));
      expect(handleChange).toHaveBeenCalledWith([1, 2, 3]);
    });
  });

  describe("<StepSuccessCelebration />", () => {
    it("renders celebration greeting and finish button", () => {
      const handleFinish = vi.fn();
      render(
        <StepSuccessCelebration
          formData={{ fullName: "Nguyễn Văn Test", occupation: "Developer", city: { name: "Hà Nội" } }}
          avatarPreview={null}
          onFinish={handleFinish}
        />
      );

      expect(screen.getByText("Chào mừng, Nguyễn Văn Test!")).toBeInTheDocument();
      expect(screen.getByText("Developer")).toBeInTheDocument();
      expect(screen.getByText("Hà Nội")).toBeInTheDocument();

      const finishButton = screen.getByRole("button", {
        name: /Bắt đầu khám phá ngay/i,
      });
      fireEvent.click(finishButton);
      expect(handleFinish).toHaveBeenCalledTimes(1);
    });
  });
});
