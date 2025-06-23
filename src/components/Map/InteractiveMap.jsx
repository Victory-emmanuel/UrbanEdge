import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { calculateMapCenter, calculateZoomLevel } from '../../utils/mapUtils';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom property marker icon
const createPropertyIcon = (isSelected = false) => {
  return L.divIcon({
    className: 'custom-property-marker',
    html: `
      <div class="relative">
        <div class="w-8 h-8 ${isSelected ? 'bg-taupe' : 'bg-brown-dark dark:bg-beige-light'} 
                    rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white ${isSelected ? '' : 'dark:text-brown-dark'}" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Component to fit map bounds to show all properties
const FitBounds = ({ properties }) => {
  const map = useMap();

  useEffect(() => {
    if (properties && properties.length > 0) {
      const validProperties = properties.filter(p => p.latitude && p.longitude);
      
      if (validProperties.length === 1) {
        // Single property - center on it
        const property = validProperties[0];
        map.setView([property.latitude, property.longitude], 15);
      } else if (validProperties.length > 1) {
        // Multiple properties - fit bounds to show all
        const bounds = L.latLngBounds(
          validProperties.map(p => [p.latitude, p.longitude])
        );
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [map, properties]);

  return null;
};

// Component to handle map events and bounds changes
const MapEventHandler = ({ onBoundsChange, onZoomChange }) => {
  const map = useMap();

  useEffect(() => {
    const handleMoveEnd = () => {
      if (onBoundsChange) {
        const bounds = map.getBounds();
        onBoundsChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      }
    };

    const handleZoomEnd = () => {
      if (onZoomChange) {
        onZoomChange(map.getZoom());
      }
    };

    map.on('moveend', handleMoveEnd);
    map.on('zoomend', handleZoomEnd);

    return () => {
      map.off('moveend', handleMoveEnd);
      map.off('zoomend', handleZoomEnd);
    };
  }, [map, onBoundsChange, onZoomChange]);

  return null;
};

const PropertyPopup = ({ property }) => {
  const formatPrice = (price) => {
    const formattedNumber = new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return `₦${formattedNumber}`;
  };

  const primaryImage = property.images && property.images.length > 0 
    ? property.images[0].image_url 
    : '/api/placeholder/300/200';

  return (
    <div className="w-64 p-2">
      <div className="bg-white dark:bg-brown-dark rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-32">
          <img
            src={primaryImage}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/api/placeholder/300/200';
            }}
          />
          <div className="absolute top-2 right-2 bg-taupe text-white px-2 py-1 rounded text-sm font-semibold">
            {formatPrice(property.price)}
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-heading font-semibold text-brown-dark dark:text-beige-light text-sm mb-1 line-clamp-1">
            {property.title}
          </h3>
          
          <p className="text-brown dark:text-beige-medium text-xs mb-2 line-clamp-1">
            {property.location}
          </p>
          
          <div className="flex items-center gap-3 text-xs text-brown dark:text-beige-medium mb-3">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              {property.bedrooms} bed
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              {property.bathrooms} bath
            </span>
          </div>
          
          <Link
            to={`/properties/${property.id}`}
            className="block w-full bg-taupe text-white text-center py-2 rounded text-xs font-semibold hover:bg-brown-dark transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const InteractiveMap = ({
  properties = [],
  selectedProperty = null,
  onPropertySelect = null,
  onBoundsChange = null,
  onZoomChange = null,
  height = '500px',
  defaultCenter = [40.7128, -74.0060], // NYC default
  defaultZoom = 10,
  enableClustering = true
}) => {
  const [selectedMarker, setSelectedMarker] = useState(selectedProperty);

  useEffect(() => {
    setSelectedMarker(selectedProperty);
  }, [selectedProperty]);

  const handleMarkerClick = (property) => {
    setSelectedMarker(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  // Filter properties that have valid coordinates
  const validProperties = properties.filter(p => p.latitude && p.longitude);

  // Determine map center and zoom
  const mapCenter = calculateMapCenter(validProperties) || defaultCenter;
  const mapZoom = validProperties.length > 0 ? calculateZoomLevel(validProperties) : defaultZoom;

  // Custom cluster icon
  const createClusterCustomIcon = (cluster) => {
    const count = cluster.getChildCount();
    let size = 'small';
    if (count >= 10) size = 'medium';
    if (count >= 100) size = 'large';

    return L.divIcon({
      html: `<div class="cluster-marker cluster-${size}"><span>${count}</span></div>`,
      className: 'custom-marker-cluster',
      iconSize: L.point(40, 40, true),
    });
  };

  const renderMarkers = () => {
    const markers = validProperties.map((property) => (
      <Marker
        key={property.id}
        position={[property.latitude, property.longitude]}
        icon={createPropertyIcon(selectedMarker?.id === property.id)}
        eventHandlers={{
          click: () => handleMarkerClick(property),
        }}
      >
        <Popup>
          <PropertyPopup property={property} />
        </Popup>
      </Marker>
    ));

    if (enableClustering && validProperties.length > 5) {
      return (
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
        >
          {markers}
        </MarkerClusterGroup>
      );
    }

    return markers;
  };

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds properties={validProperties} />
        <MapEventHandler onBoundsChange={onBoundsChange} onZoomChange={onZoomChange} />

        {renderMarkers()}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
