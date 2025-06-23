import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom property marker icon for single property
const createSinglePropertyIcon = () => {
  return L.divIcon({
    className: 'custom-single-property-marker',
    html: `
      <div class="relative">
        <div class="w-10 h-10 bg-taupe rounded-full border-3 border-white shadow-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-taupe"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const PropertyLocationMap = ({ 
  property,
  height = '400px',
  showPopup = true,
  zoom = 15
}) => {
  // Return null if no property or coordinates
  if (!property || !property.latitude || !property.longitude) {
    return (
      <div 
        className="w-full bg-beige-light dark:bg-brown rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center p-6">
          <svg className="w-12 h-12 text-brown dark:text-beige-medium mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <p className="text-brown-dark dark:text-beige-light font-semibold mb-1">
            Location Not Available
          </p>
          <p className="text-brown dark:text-beige-medium text-sm">
            Map coordinates are not available for this property.
          </p>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    const formattedNumber = new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return `₦${formattedNumber}`;
  };

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <MapContainer
        center={[property.latitude, property.longitude]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker
          position={[property.latitude, property.longitude]}
          icon={createSinglePropertyIcon()}
        >
          {showPopup && (
            <Popup>
              <div className="w-56 p-2">
                <div className="bg-white dark:bg-brown-dark rounded-lg overflow-hidden">
                  <div className="p-3">
                    <h3 className="font-heading font-semibold text-brown-dark dark:text-beige-light text-sm mb-2">
                      {property.title}
                    </h3>
                    
                    <p className="text-brown dark:text-beige-medium text-xs mb-2">
                      {property.location}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-taupe font-semibold text-sm">
                        {formatPrice(property.price)}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-brown dark:text-beige-medium">
                        <span>{property.bedrooms} bed</span>
                        <span>•</span>
                        <span>{property.bathrooms} bath</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyLocationMap;
