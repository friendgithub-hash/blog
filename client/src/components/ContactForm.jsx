import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import axios from "axios";

const ContactForm = () => {
  const { user, isLoaded } = useUser();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: null,
    email: null,
    subject: null,
    message: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState(null);

  // Pre-fill form for authenticated users
  useEffect(() => {
    if (isLoaded && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || user.username || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [isLoaded, user]);

  // Validate individual field
  const validateField = (field, value) => {
    switch (field) {
      case "name":
        if (!value.trim()) return t("form.nameRequired");
        if (value.trim().length < 2) return t("form.nameMinLength");
        return null;

      case "email":
        if (!value.trim()) return t("form.emailRequired");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return t("form.emailInvalid");
        return null;

      case "subject":
        if (!value.trim()) return t("form.subjectRequired");
        if (value.trim().length < 3) return t("form.subjectMinLength");
        return null;

      case "message":
        if (!value.trim()) return t("form.messageRequired");
        if (value.trim().length < 10) return t("form.messageMinLength");
        if (value.trim().length > 1000) return t("form.messageMaxLength");
        return null;

      default:
        return null;
    }
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      subject: validateField("subject", formData.subject),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== null);
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [field]: null }));
    // Clear submit status when user starts typing again
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setSubmitMessage(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/contact`,
        formData,
      );

      if (response.data.success) {
        setSubmitStatus("success");
        setSubmitMessage(response.data.message || t("form.successMessage"));
        // Clear form
        setFormData({
          name: user?.fullName || user?.username || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      setSubmitStatus("error");
      if (error.response?.data?.message) {
        setSubmitMessage(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        setErrors(error.response.data.errors);
        setSubmitMessage(t("form.correctErrors"));
      } else {
        setSubmitMessage(t("form.errorMessage"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{t("form.contactUs")}</h2>

      {submitStatus === "success" && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {submitMessage}
        </div>
      )}

      {submitStatus === "error" && submitMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {submitMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("form.name")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder={t("form.namePlaceholder")}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            aria-required="true"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("form.email")} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder={t("form.emailPlaceholder")}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            aria-required="true"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("form.subject")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            placeholder={t("form.subjectPlaceholder")}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.subject ? "border-red-500" : "border-gray-300"
            }`}
            aria-required="true"
            aria-invalid={errors.subject ? "true" : "false"}
            aria-describedby={errors.subject ? "subject-error" : undefined}
          />
          {errors.subject && (
            <p id="subject-error" className="mt-1 text-sm text-red-600">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("form.message")} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder={t("form.messagePlaceholder")}
            rows="6"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            aria-required="true"
            aria-invalid={errors.message ? "true" : "false"}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          <div className="flex justify-between items-start mt-1">
            {errors.message ? (
              <p id="message-error" className="text-sm text-red-600">
                {errors.message}
              </p>
            ) : (
              <span className="text-sm text-gray-500">
                {t("form.charactersCount", { count: formData.message.length })}
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isSubmitting ? t("form.sending") : t("form.sendMessage")}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
