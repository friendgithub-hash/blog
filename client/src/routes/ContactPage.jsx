import { useTranslation } from "react-i18next";
import AboutUs from "../components/AboutUs";
import ContactForm from "../components/ContactForm";
import SEO from "../components/SEO";

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        titleKey="seo.contact.title"
        descriptionKey="seo.contact.description"
        url="/contact"
        type="website"
      />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-600">
          <span>{t("breadcrumb.home")}</span> <span className="mx-2">/</span>{" "}
          <span className="text-gray-900 font-medium">
            {t("breadcrumb.contact")}
          </span>
        </div>

        {/* Two-column layout on desktop, single column on mobile/tablet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: About Us */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <AboutUs />
          </div>

          {/* Right column: Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
