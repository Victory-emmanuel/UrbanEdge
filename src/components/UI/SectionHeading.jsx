import { LightMotion } from "../../utils/lightMotion";
import PropTypes from "prop-types";

const SectionHeading = ({
  title,
  subtitle,
  centered = false,
  light = false,
  className = "",
}) => {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""} ${className}`}>
      <LightMotion
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className={`font-heading font-bold mb-2 xs:mb-4 text-xl xs:text-2xl sm:text-3xl md:text-4xl ${
          light ? "text-beige-light" : "text-brown-dark dark:text-beige-light"
        }`}
      >
        <h2>{title}</h2>
      </LightMotion>

      {subtitle && (
        <LightMotion
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`max-w-2xl text-sm xs:text-base ${
            centered ? "mx-auto" : ""
          } ${
            light ? "text-beige-medium" : "text-brown dark:text-beige-medium"
          }`}
        >
          <p>{subtitle}</p>
        </LightMotion>
      )}
    </div>
  );
};

SectionHeading.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  centered: PropTypes.bool,
  light: PropTypes.bool,
  className: PropTypes.string,
};

export default SectionHeading;
