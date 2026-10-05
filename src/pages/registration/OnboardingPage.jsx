import React from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { AuthSplitLayout } from "../../features/auth";
import {
  useOnboarding,
  OnboardingStepper,
  Step1Identity,
  Step2Preferences,
  Step3InterestsLocation,
  StepSuccessCelebration,
} from "../../features/onboarding";

/**
 * OnboardingPage: Trang thiết lập hồ sơ ban đầu sau khi đăng nhập
 * - Kiến trúc Orchestrator tinh gọn (< 120 dòng)
 * - Multi-Step Guided Flow (3 bước + 1 màn hình chúc mừng)
 * - Tối ưu trải nghiệm người dùng (UX) vượt bậc
 */
export default function OnboardingPage() {
  const {
    activeStep,
    formData,
    avatarPreview,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    handleAvatarChange,
    handleNextFromStep1,
    handleNextFromStep2,
    handleBack,
    handleSubmitProfile,
    handleFinish,
    handleLogout,
  } = useOnboarding();

  const stepTitles = {
    1: {
      title: "Hãy xác nhận diện mạo",
      subtitle: "Thêm ảnh đại diện và thông tin cơ bản để bắt đầu.",
    },
    2: {
      title: "Định hướng kết nối",
      subtitle: "Chia sẻ mong muốn để Connect gợi ý những người bạn phù hợp.",
    },
    3: {
      title: "Sở thích & Nơi ở",
      subtitle: "Chọn điều bạn quan tâm và khu vực bạn đang sinh sống.",
    },
    4: {
      title: "",
      subtitle: "",
    },
  };

  const currentHeader = stepTitles[activeStep] || stepTitles[1];

  return (
    <AuthSplitLayout
      title={currentHeader.title}
      subtitle={currentHeader.subtitle}
      heroTitle="Bắt đầu hành trình kết nối chân thực."
      heroSubtitle="Chỉ mất 2 phút để hoàn tất hồ sơ và tìm kiếm những người bạn cùng tần số."
    >
      {/* Chỉ báo tiến trình 3 bước (ẩn khi ở màn hình chúc mừng) */}
      {activeStep <= 3 && <OnboardingStepper activeStep={activeStep} />}

      {/* Render từng bước theo trạng thái activeStep */}
      {activeStep === 1 && (
        <Step1Identity
          formData={formData}
          errors={errors}
          touched={touched}
          avatarPreview={avatarPreview}
          onAvatarChange={handleAvatarChange}
          onChangeField={setFieldValue}
          onNext={handleNextFromStep1}
        />
      )}

      {activeStep === 2 && (
        <Step2Preferences
          formData={formData}
          errors={errors}
          touched={touched}
          onChangeField={setFieldValue}
          onNext={handleNextFromStep2}
          onBack={handleBack}
        />
      )}

      {activeStep === 3 && (
        <Step3InterestsLocation
          formData={formData}
          errors={errors}
          touched={touched}
          onChangeField={setFieldValue}
          onSubmit={handleSubmitProfile}
          onBack={handleBack}
          isSubmitting={isSubmitting}
        />
      )}

      {activeStep === 4 && (
        <StepSuccessCelebration
          formData={formData}
          avatarPreview={avatarPreview}
          onFinish={handleFinish}
        />
      )}

      {/* Nút thoát / Đăng xuất ở chân trang */}
      {activeStep <= 3 && (
        <div className="mt-8 text-center pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-text-muted hover:text-text-main transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <ArrowLeft size={14} />
            <span>Đăng xuất & Thiết lập sau</span>
          </button>
        </div>
      )}
    </AuthSplitLayout>
  );
}
