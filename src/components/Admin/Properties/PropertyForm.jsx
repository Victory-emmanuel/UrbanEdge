import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { propertyService } from "../../../lib/propertyService";
import { useAuth } from "../../../contexts/AuthContext";
import {
  handleImageError,
  isValidImageUrl,
  sanitizeImageUrl,
  getFallbackImage,
  preloadImage
} from "../../../utils/imageUtils";

/**
 * Property Form component for creating and editing properties
 */
const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isEditMode = Boolean(id);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      location: "",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      squareFeet: 0,
      description: "",
      floorPlanUrl: "",
      neighborhood: "",
      propertyTypeId: "",
      saleTypeId: "",
      latitude: "",
      longitude: ""
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [saleTypes, setSaleTypes] = useState([]);
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [geocoding, setGeocoding] = useState(false);

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  // Fetch property types, sale types, and features
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [propertyTypesRes, saleTypesRes, featuresRes] = await Promise.all(
          [
            propertyService.getPropertyTypes(),
            propertyService.getSaleTypes(),
            propertyService.getFeatures(),
          ]
        );

        if (propertyTypesRes.error) throw propertyTypesRes.error;
        if (saleTypesRes.error) throw saleTypesRes.error;
        if (featuresRes.error) throw featuresRes.error;

        setPropertyTypes(propertyTypesRes.data || []);
        setSaleTypes(saleTypesRes.data || []);
        setFeatures(featuresRes.data || []);
      } catch (err) {
        console.error("Error fetching reference data:", err);
        setError("Failed to load form data. Please try again.");
      }
    };

    fetchReferenceData();
  }, []);

  // Fetch property data if in edit mode
  useEffect(() => {
    const fetchProperty = async () => {
      if (!isEditMode) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await propertyService.getPropertyById(id);
        if (error) throw error;
        if (!data) throw new Error("Property not found");

        console.log('Fetched property data:', data); // Debug log

        // Handle the nested structure returned by get_property_details
        const propertyData = data.property || data;

        // Prepare form data for reset
        const formData = {
          title: propertyData.title?.replace(/^"|"$/g, '') || "", // Remove quotes if present
          location: propertyData.location?.replace(/^"|"$/g, '') || "",
          price: propertyData.price || 0,
          bedrooms: propertyData.bedrooms || 0,
          bathrooms: propertyData.bathrooms || 0,
          squareFeet: propertyData.square_feet || 0,
          description: propertyData.description?.replace(/^"|"$/g, '') || "",
          floorPlanUrl: propertyData.floor_plan_url || "",
          neighborhood: propertyData.neighborhood?.replace(/^"|"$/g, '') || "",
          propertyTypeId: propertyData.property_type_id || "",
          saleTypeId: propertyData.sale_type_id || "",
          latitude: propertyData.latitude ? propertyData.latitude.toString() : "",
          longitude: propertyData.longitude ? propertyData.longitude.toString() : ""
        };

        console.log('Form data to reset with:', formData);

        // Use reset instead of individual setValue calls for better form population
        reset(formData);

        // Set images - handle the structure returned by get_property_details
        if (data.images && data.images.length > 0) {
          setImages(
            data.images.map((img) => ({
              id: img.id,
              url: img.image_url,
              order: img.order || 0,
            }))
          );
        } else if (propertyData.property_images && propertyData.property_images.length > 0) {
          // Fallback for other data structures
          setImages(
            propertyData.property_images.map((img) => ({
              id: img.id,
              url: img.image_url,
              order: img.order || 0,
            }))
          );
        }

        // Set features - handle the structure returned by get_property_details
        if (data.features && data.features.length > 0) {
          const featureIds = data.features
            .map((f) => f.id)
            .filter(Boolean);
          setSelectedFeatures(featureIds);
          console.log('Set selected features:', featureIds); // Debug log
        } else if (propertyData.property_features && propertyData.property_features.length > 0) {
          // Fallback for other data structures
          const featureIds = propertyData.property_features
            .map((pf) => pf.feature?.id || pf.feature_id)
            .filter(Boolean);
          setSelectedFeatures(featureIds);
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, isEditMode, reset]);

  // Debug useEffect to monitor form values
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log('Form value changed:', { name, type, value: value[name] });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Ensure proper data types for numeric fields and clean up data
      const propertyData = {
        title: data.title?.trim() || '',
        location: data.location?.trim() || '',
        price: parseFloat(data.price) || 0,
        bedrooms: parseInt(data.bedrooms) || 0,
        bathrooms: parseInt(data.bathrooms) || 0,
        squareFeet: parseInt(data.squareFeet) || 0,
        description: data.description?.trim() || '',
        floorPlanUrl: data.floorPlanUrl?.trim() || '',
        neighborhood: data.neighborhood?.trim() || '',
        propertyTypeId: data.propertyTypeId?.trim() || '',
        saleTypeId: data.saleTypeId?.trim() || '',
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        images: images,
        features: selectedFeatures,
      };

      // Log the data being sent for debugging
      console.log('Submitting property data:', propertyData);

      let result;
      if (isEditMode) {
        console.log('Updating property with ID:', id);
        result = await propertyService.updateProperty(id, propertyData);
      } else {
        console.log('Creating new property');
        result = await propertyService.createProperty(propertyData);
      }

      if (result.error) {
        console.error('Property service error:', result.error);
        throw result.error;
      }

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error saving property:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle adding a new image with validation
  const handleAddImage = async () => {
    if (!newImageUrl.trim()) {
      setError("Please enter an image URL");
      return;
    }

    // Validate the image URL
    if (!isValidImageUrl(newImageUrl)) {
      setError("Please enter a valid image URL (must be a direct link to an image file or from a supported image hosting service)");
      return;
    }

    // Sanitize the URL
    const sanitizedUrl = sanitizeImageUrl(newImageUrl, 'form');

    // Optional: Preload image to verify it loads successfully
    const imageLoads = await preloadImage(sanitizedUrl);
    if (!imageLoads) {
      setError("The image URL appears to be invalid or the image cannot be loaded. Please check the URL and try again.");
      return;
    }

    // Clear any previous errors
    setError(null);

    // Add the validated image
    setImages([
      ...images,
      {
        url: sanitizedUrl,
        order: images.length,
      },
    ]);
    setNewImageUrl("");
  };

  // Handle removing an image
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Handle feature selection
  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(featureId)) {
        return prev.filter((id) => id !== featureId);
      } else {
        return [...prev, featureId];
      }
    });
  };

  // Handle automatic geocoding
  const handleGeocode = async () => {
    const location = watch("location");
    if (!location || location.trim() === "") {
      setError("Please enter a location first");
      return;
    }

    setGeocoding(true);
    setError(null);

    try {
      const coordinates = await propertyService.geocodeAddress(location);
      if (coordinates) {
        // Update form values with coordinates
        reset({
          ...watch(),
          latitude: coordinates.latitude.toString(),
          longitude: coordinates.longitude.toString()
        });
      } else {
        setError("Could not find coordinates for this location. Please enter them manually.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("Failed to geocode address. Please enter coordinates manually.");
    } finally {
      setGeocoding(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="container mx-auto p-6 text-center">
        Loading property data...
      </div>
    );
  }


  //   <div className="container mx-auto p-6">
  //     <h1 className="text-3xl font-bold mb-6">
  //       {isEditMode ? "Edit Property" : "Add New Property"}
  //     </h1>

  //     {error && (
  //       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
  //         {error}
  //       </div>
  //     )}

  //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         {/* Basic Information */}
  //         <div className="space-y-4">
  //           <h2 className="text-xl font-semibold">Basic Information</h2>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">
  //               Title *
  //             </label>
  //             <input
  //               type="text"
  //               {...register("title", { required: "Title is required" })}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //             />

  //             {errors.title && (
  //               <p className="mt-1 text-sm text-red-600">
  //                 {errors.title.message}
  //               </p>
  //             )}
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">
  //               Location *
  //             </label>
  //             <input
  //               type="text"
  //               {...register("location", { required: "Location is required" })}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //             />

  //             {errors.location && (
  //               <p className="mt-1 text-sm text-red-600">
  //                 {errors.location.message}
  //               </p>
  //             )}
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">
  //               Neighborhood
  //             </label>
  //             <input
  //               type="text"
  //               {...register("neighborhood")}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //             />
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">
  //               Price ($) *
  //             </label>
  //             <input
  //               type="number"
  //               {...register("price", {
  //                 required: "Price is required",
  //                 min: { value: 0, message: "Price must be positive" },
  //               })}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //             />

  //             {errors.price && (
  //               <p className="mt-1 text-sm text-red-600">
  //                 {errors.price.message}
  //               </p>
  //             )}
  //           </div>

  //           <div className="grid grid-cols-3 gap-4">
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-1">
  //                 Bedrooms *
  //               </label>
  //               <input
  //                 type="number"
  //                 {...register("bedrooms", {
  //                   required: "Required",
  //                   min: { value: 0, message: "Min 0" },
  //                 })}
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //               />

  //               {errors.bedrooms && (
  //                 <p className="mt-1 text-sm text-red-600">
  //                   {errors.bedrooms.message}
  //                 </p>
  //               )}
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-1">
  //                 Bathrooms *
  //               </label>
  //               <input
  //                 type="number"
  //                 {...register("bathrooms", {
  //                   required: "Required",
  //                   min: { value: 0, message: "Min 0" },
  //                 })}
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //               />

  //               {errors.bathrooms && (
  //                 <p className="mt-1 text-sm text-red-600">
  //                   {errors.bathrooms.message}
  //                 </p>
  //               )}
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-1">
  //                 Square Feet *
  //               </label>
  //               <input
  //                 type="number"
  //                 {...register("squareFeet", {
  //                   required: "Required",
  //                   min: { value: 0, message: "Min 0" },
  //                 })}
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //               />

  //               {errors.squareFeet && (
  //                 <p className="mt-1 text-sm text-red-600">
  //                   {errors.squareFeet.message}
  //                 </p>
  //               )}
  //             </div>
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">
  //               Property Type *
  //             </label>
  //             <select
  //               {...register("propertyTypeId", {
  //                 required: "Property type is required",
  //               })}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //             >
  //               <option value="">Select a property type</option>
  //               {propertyTypes.map((type) => (
  //                 <option key={type.id} value={type.id}>
  //                   {type.name}
  //                 </option>
  //               ))}
  //             </select>
  //             {errors.propertyTypeId && (
  //               <p className="mt-1 text-sm text-red-600">
  //                 {errors.propertyTypeId.message}
  //               </p>
  //             )}
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">
  //               Sale Type *
  //             </label>
  //             <select
  //               {...register("saleTypeId", {
  //                 required: "Sale type is required",
  //               })}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //             >
  //               <option value="">Select a sale type</option>
  //               {saleTypes.map((type) => (
  //                 <option key={type.id} value={type.id}>
  //                   {type.name}
  //                 </option>
  //               ))}
  //             </select>
  //             {errors.saleTypeId && (
  //               <p className="mt-1 text-sm text-red-600">
  //                 {errors.saleTypeId.message}
  //               </p>
  //             )}
  //           </div>
  //         </div>

  //         {/* Additional Information */}
  //         <div className="space-y-4">
  //           <h2 className="text-xl font-semibold">Additional Information</h2>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">
  //               Description
  //             </label>
  //             <textarea
  //               {...register("description")}
  //               rows="4"
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //             ></textarea>
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">
  //               Floor Plan URL
  //             </label>
  //             <input
  //               type="text"
  //               {...register("floorPlanUrl")}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //             />
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">
  //               Features
  //             </label>
  //             <div className="grid grid-cols-2 gap-2">
  //               {features.map((feature) => (
  //                 <div key={feature.id} className="flex items-center">
  //                   <input
  //                     type="checkbox"
  //                     id={`feature-${feature.id}`}
  //                     checked={selectedFeatures.includes(feature.id)}
  //                     onChange={() => handleFeatureToggle(feature.id)}
  //                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
  //                   />

  //                   <label
  //                     htmlFor={`feature-${feature.id}`}
  //                     className="ml-2 text-sm text-gray-700"
  //                   >
  //                     {feature.name}
  //                   </label>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">
  //               Images
  //             </label>
  //             <div className="flex space-x-2 mb-2">
  //               <input
  //                 type="text"
  //                 value={newImageUrl}
  //                 onChange={(e) => setNewImageUrl(e.target.value)}
  //                 placeholder="Enter image URL"
  //                 className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //               />

  //               <button
  //                 type="button"
  //                 onClick={handleAddImage}
  //                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  //               >
  //                 Add
  //               </button>
  //             </div>

  //             {images.length > 0 ? (
  //               <div className="grid grid-cols-2 gap-4">
  //                 {images.map((image, index) => (
  //                   <div key={index} className="relative">
  //                     <img
  //                       src={image.url}
  //                       alt={`Property ${index + 1}`}
  //                       className="w-full h-32 object-cover rounded-md"
  //                       onError={(e) => {
  //                         e.target.onerror = null;
  //                         e.target.src =
  //                           "https://via.placeholder.com/150?text=Image+Error";
  //                       }}
  //                     />

  //                     <button
  //                       type="button"
  //                       onClick={() => handleRemoveImage(index)}
  //                       className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
  //                     >
  //                       ×
  //                     </button>
  //                   </div>
  //                 ))}
  //               </div>
  //             ) : (
  //               <p className="text-sm text-gray-500">No images added yet.</p>
  //             )}
  //           </div>
  //         </div>
  //       </div>

  //       <div className="flex justify-end space-x-4">
  //         <button
  //           type="button"
  //           onClick={() => navigate("/admin/dashboard")}
  //           className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  //         >
  //           Cancel
  //         </button>
  //         <button
  //           type="submit"
  //           disabled={loading}
  //           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
  //         >
  //           {loading
  //             ? "Saving..."
  //             : isEditMode
  //               ? "Update Property"
  //               : "Create Property"}
  //         </button>
  //       </div>
  //     </form>
  //   </div>
  // );
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        {isEditMode ? "Edit Property" : "Add New Property"}
      </h1>

      {error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg mb-4 shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Title *
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />

              {errors.title && (
                <p className="mt-2 text-sm text-red-700 font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Location *
              </label>
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />

              {errors.location && (
                <p className="mt-2 text-sm text-red-700 font-medium">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Neighborhood
              </label>
              <input
                type="text"
                {...register("neighborhood")}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Map Coordinates Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Map Coordinates</h3>
                <button
                  type="button"
                  onClick={handleGeocode}
                  disabled={geocoding}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-3 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                >
                  {geocoding ? "Finding..." : "Auto-Find Coordinates"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register("latitude")}
                    placeholder="e.g., 40.7128"
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register("longitude")}
                    placeholder="e.g., -74.0060"
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>

              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <strong>Tip:</strong> Enter the location address above and click "Auto-Find Coordinates" to automatically populate these fields, or enter coordinates manually.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />

              {errors.price && (
                <p className="mt-2 text-sm text-red-700 font-medium">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  {...register("bedrooms", {
                    required: "Required",
                    min: { value: 0, message: "Min 0" },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                />

                {errors.bedrooms && (
                  <p className="mt-2 text-sm text-red-700 font-medium">
                    {errors.bedrooms.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  {...register("bathrooms", {
                    required: "Required",
                    min: { value: 0, message: "Min 0" },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                />

                {errors.bathrooms && (
                  <p className="mt-2 text-sm text-red-700 font-medium">
                    {errors.bathrooms.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Square Feet *
                </label>
                <input
                  type="number"
                  {...register("squareFeet", {
                    required: "Required",
                    min: { value: 0, message: "Min 0" },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                />

                {errors.squareFeet && (
                  <p className="mt-2 text-sm text-red-700 font-medium">
                    {errors.squareFeet.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Property Type *
              </label>
              <select
                {...register("propertyTypeId", {
                  required: "Property type is required",
                })}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              >
                <option value="" className="text-gray-500">
                  Select a property type
                </option>
                {propertyTypes.map((type) => (
                  <option
                    key={type.id}
                    value={type.id}
                    className="text-gray-900"
                  >
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.propertyTypeId && (
                <p className="mt-2 text-sm text-red-700 font-medium">
                  {errors.propertyTypeId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Sale Type *
              </label>
              <select
                {...register("saleTypeId", {
                  required: "Sale type is required",
                })}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              >
                <option value="" className="text-gray-500">
                  Select a sale type
                </option>
                {saleTypes.map((type) => (
                  <option
                    key={type.id}
                    value={type.id}
                    className="text-gray-900"
                  >
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.saleTypeId && (
                <p className="mt-2 text-sm text-red-700 font-medium">
                  {errors.saleTypeId.message}
                </p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
              Additional Information
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm resize-vertical"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Floor Plan URL
              </label>
              <input
                type="text"
                {...register("floorPlanUrl")}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Features
              </label>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center bg-gray-50 p-2 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      id={`feature-${feature.id}`}
                      checked={selectedFeatures.includes(feature.id)}
                      onChange={() => handleFeatureToggle(feature.id)}
                      className="h-5 w-5 text-blue-600 bg-white border-2 border-gray-400 rounded focus:ring-3 focus:ring-blue-500 focus:ring-offset-0"
                    />

                    <label
                      htmlFor={`feature-${feature.id}`}
                      className="ml-3 text-sm text-gray-800 font-medium cursor-pointer"
                    >
                      {feature.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Images
              </label>
              <div className="mb-2">
                <p className="text-xs text-gray-600 mb-3">
                  Add images by entering direct image URLs. Supported formats: JPG, PNG, GIF, WebP.
                  Recommended sources: Unsplash, your own hosting, or other reliable image services.
                </p>
              </div>
              <div className="flex space-x-3 mb-4">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Enter image URL (e.g., https://images.unsplash.com/...)"
                  className="flex-1 px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                />

                <button
                  type="button"
                  onClick={handleAddImage}
                  disabled={!newImageUrl.trim()}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                >
                  Add
                </button>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden shadow-md"
                    >
                      <img
                        src={image.url}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover"
                        onError={(e) => handleImageError(e, 'form')}
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 font-bold text-lg transition-all duration-200 shadow-md"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  No images added yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="px-6 py-3 border-2 border-gray-400 rounded-lg text-gray-800 font-semibold bg-white hover:bg-gray-50 focus:outline-none focus:ring-3 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Property"
              : "Create Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
