import { StarIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";

const TestimonialCard = ({ testimonial }) => {
  const { name, role, image, quote, rating } = testimonial;

  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-4 w-4 xs:h-5 xs:w-5 ${
            i < rating ? "text-taupe" : "text-beige-medium dark:text-brown"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white dark:bg-brown-dark rounded-lg shadow-md p-4 xs:p-5 sm:p-6 flex flex-col h-full">
      {/* Stars */}
      <div className="flex mb-3 xs:mb-4">{renderStars()}</div>

      {/* Quote */}
      <blockquote className="mb-4 xs:mb-6 flex-grow">
        <p className="italic text-sm xs:text-base text-brown dark:text-beige-medium">
          &ldquo;{quote}&rdquo;
        </p>
      </blockquote>

      {/* Author */}
      <div className="flex items-center">
        <img
          src={image}
          alt={name}
          className="w-10 h-10 xs:w-12 xs:h-12 rounded-full object-cover mr-3 xs:mr-4"
        />

        <div>
          <p className="font-medium text-sm xs:text-base text-brown-dark dark:text-beige-light">
            {name}
          </p>
          <p className="text-xs xs:text-sm text-brown dark:text-beige-medium">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
};

TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    quote: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
};

export default TestimonialCard;
