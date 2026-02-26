const AboutUs = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <h2 className="text-2xl font-bold mb-4">
        About Us: Revolutionizing UV Ink Supply with Intelligent Precision
      </h2>

      <p className="mb-4">
        At our core, we are an{" "}
        <strong>
          independent developer, manufacturer, and global supplier
        </strong>{" "}
        of advanced ink supply solutions for the UV printing industry. With
        years of market application and verification, our systems have earned
        the trust of equipment manufacturers and terminal users worldwide by
        delivering unmatched stability and performance.
      </p>

      <p className="mb-4">
        We specialize in the development of{" "}
        <strong>Intelligent PID Dynamic Negative Pressure Systems</strong>. Our
        systems are designed to meet the rigorous demands of industrial
        production:
      </p>

      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>
          <strong>High-Speed Response:</strong> Utilizing PID technology, the
          system adjusts pressure every <strong>5 milliseconds</strong> and
          reaches a constant state within <strong>3 seconds</strong> of startup.
        </li>
        <li>
          <strong>Precision Control:</strong> We offer sampling accuracy of{" "}
          <strong>0.001Kpa</strong> and control accuracy of{" "}
          <strong>0.01Kpa</strong>, ensuring a stable ink meniscus at the nozzle
          for superior print sharpness and uniformity.
        </li>
        <li>
          <strong>Industrial Durability:</strong> Every unit is built with
          high-quality components, including low-noise{" "}
          <strong>brushless motors</strong> with a service life exceeding{" "}
          <strong>30,000 hours</strong>.
        </li>
      </ul>
    </div>
  );
};

export default AboutUs;
