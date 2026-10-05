import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { createProfile, logout } from "../../../redux/slices/authSlice";
import { uploadAvatar } from "../../../utils/uploadImage";

// Schemas xác thực riêng cho từng bước
const Step1Schema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(50, "Họ tên không được quá 50 ký tự")
    .required("Vui lòng nhập họ và tên"),
  dateOfBirth: Yup.date()
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 16)),
      "Bạn phải từ 16 tuổi trở lên để tham gia Connect"
    )
    .required("Vui lòng chọn ngày sinh"),
  occupation: Yup.string()
    .min(2, "Nghề nghiệp phải có ít nhất 2 ký tự")
    .max(50, "Nghề nghiệp không được quá 50 ký tự")
    .required("Vui lòng nhập nghề nghiệp"),
});

const Step2Schema = Yup.object().shape({
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "Vui lòng chọn giới tính")
    .required("Vui lòng chọn giới tính"),
  maritalStatus: Yup.string()
    .oneOf(["single", "divorced", "widowed"], "Vui lòng chọn tình trạng hôn nhân")
    .required("Vui lòng chọn tình trạng hôn nhân"),
  purpose: Yup.string()
    .oneOf(["love", "friends", "networking"], "Vui lòng chọn mục đích tham gia")
    .required("Vui lòng chọn mục đích tham gia"),
});

const Step3Schema = Yup.object().shape({
  hobbies: Yup.array()
    .min(1, "Vui lòng chọn ít nhất 1 sở thích")
    .required("Vui lòng chọn sở thích"),
  city: Yup.mixed().test(
    "has-city",
    "Vui lòng chọn tỉnh / thành phố",
    (value) => Boolean(value && (value.code || value.name))
  ),
});

/**
 * useOnboarding: Hook quản lý toàn bộ luồng tạo hồ sơ đa bước
 */
export function useOnboarding() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasProfile } = useSelector((state) => state.auth);

  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    occupation: "",
    gender: "",
    maritalStatus: "",
    purpose: "",
    hobbies: [],
    city: null,
    avatar: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nếu user đã có profile đầy đủ, chuyển ngay vào feed
  useEffect(() => {
    if (hasProfile) {
      navigate("/dashboard/feed");
    }
  }, [hasProfile, navigate]);

  const setFieldValue = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleAvatarChange = (file, previewUrl) => {
    setFormData((prev) => ({ ...prev, avatar: file }));
    setAvatarPreview(previewUrl);
    setErrors((prev) => ({ ...prev, avatar: undefined }));
    setTouched((prev) => ({ ...prev, avatar: true }));
  };

  // Xác thực bước 1 và chuyển tiếp
  const handleNextFromStep1 = async () => {
    setTouched((prev) => ({
      ...prev,
      fullName: true,
      dateOfBirth: true,
      occupation: true,
    }));

    try {
      await Step1Schema.validate(
        {
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          occupation: formData.occupation,
        },
        { abortEarly: false }
      );
      setErrors((prev) => ({
        ...prev,
        fullName: undefined,
        dateOfBirth: undefined,
        occupation: undefined,
      }));
      setActiveStep(2);
    } catch (err) {
      const stepErrors = {};
      err.inner?.forEach((e) => {
        stepErrors[e.path] = e.message;
      });
      setErrors((prev) => ({ ...prev, ...stepErrors }));
    }
  };

  // Xác thực bước 2 và chuyển tiếp
  const handleNextFromStep2 = async () => {
    setTouched((prev) => ({
      ...prev,
      gender: true,
      maritalStatus: true,
      purpose: true,
    }));

    try {
      await Step2Schema.validate(
        {
          gender: formData.gender,
          maritalStatus: formData.maritalStatus,
          purpose: formData.purpose,
        },
        { abortEarly: false }
      );
      setErrors((prev) => ({
        ...prev,
        gender: undefined,
        maritalStatus: undefined,
        purpose: undefined,
      }));
      setActiveStep(3);
    } catch (err) {
      const stepErrors = {};
      err.inner?.forEach((e) => {
        stepErrors[e.path] = e.message;
      });
      setErrors((prev) => ({ ...prev, ...stepErrors }));
    }
  };

  // Nút quay lại bước trước
  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
  };

  // Xác thực bước 3 và submit toàn bộ form
  const handleSubmitProfile = async () => {
    setTouched((prev) => ({
      ...prev,
      hobbies: true,
      city: true,
    }));

    try {
      await Step3Schema.validate(
        {
          hobbies: formData.hobbies,
          city: formData.city,
        },
        { abortEarly: false }
      );
    } catch (err) {
      const stepErrors = {};
      err.inner?.forEach((e) => {
        stepErrors[e.path] = e.message;
      });
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }

    setIsSubmitting(true);
    let avatarUrl = null;

    if (formData.avatar) {
      try {
        avatarUrl = await uploadAvatar(formData.avatar);
      } catch (error) {
        toast.error(error.message || "Tải ảnh đại diện thất bại");
        setErrors((prev) => ({ ...prev, avatar: error.message }));
        setIsSubmitting(false);
        return;
      }
    }

    const profileData = {
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      occupation: formData.occupation,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      purpose: formData.purpose,
      hobbyIds: formData.hobbies,
      cityCode: formData.city?.code,
      cityName: formData.city?.name,
      avatarUrl: avatarUrl,
    };

    try {
      await dispatch(createProfile(profileData)).unwrap();
      toast.success("Thiết lập hồ sơ thành công!");
      setActiveStep(4); // Sang màn hình chúc mừng
    } catch (error) {
      console.error("Tạo profile thất bại:", error);
      toast.error(error.message || "Không thể tạo hồ sơ. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    navigate("/dashboard/feed");
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch {
      // Ignore
    } finally {
      navigate("/login");
    }
  };

  return {
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
  };
}

export default useOnboarding;
