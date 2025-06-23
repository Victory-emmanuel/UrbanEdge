import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import InteractiveMap from '../components/Map/InteractiveMap';
import PropertyLocationMap from '../components/Map/PropertyLocationMap';
import MapSearchBox from '../components/Map/MapSearchBox';
import MapControls, { CompactMapControls, MapLegend } from '../components/Map/MapControls';
import { propertyService } from '../lib/propertyService';
import { runAllMapTests } from '../tests/mapFunctionality.test';

/**
 * Map Demo Page
 * Showcases all map functionality and features
 */
const MapDemoPage = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demoMode, setDemoMode] = useState('interactive');
  const [testResults, setTestResults] = useState('');

  // Demo modes
  const demoModes = [
    { id: 'interactive', name: 'Interactive Map', description: 'Multiple properties with clustering' },
    { id: 'single', name: 'Single Property', description: 'Individual property location' },
    { id: 'search', name: 'Map Search', description: 'Location search functionality' },
    { id: 'controls', name: 'Map Controls', description: 'Control components demo' }
  ];

  // Sample property for single property demo
  const sampleProperty = {
    id: 'demo-1',
    title: 'Demo Luxury Apartment',
    location: 'Manhattan, New York, NY',
    latitude: 40.7589,
    longitude: -73.9851,
    price: 2500000,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1500,
    images: [
      { image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500' }
    ]
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await propertyService.getProperties({
        limit: 20
      });

      if (fetchError) throw new Error(fetchError.message);

      setProperties(data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message);
      // Use sample data if fetch fails
      setProperties([sampleProperty]);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  const handleLocationSelect = (location) => {
    console.log('Location selected:', location);
  };

  const handleRunTests = async () => {
    setTestResults('Running tests...');
    
    // Capture console output
    const originalLog = console.log;
    let output = '';
    
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalLog(...args);
    };

    try {
      await runAllMapTests();
      setTestResults(output);
    } catch (error) {
      setTestResults(`Test error: ${error.message}\n${output}`);
    } finally {
      console.log = originalLog;
    }
  };

  const renderDemo = () => {
    switch (demoMode) {
      case 'interactive':
        return (
          <div className="h-96 relative">
            <InteractiveMap
              properties={properties}
              selectedProperty={selectedProperty}
              onPropertySelect={handlePropertySelect}
              height="100%"
              enableClustering={true}
            />
          </div>
        );

      case 'single':
        return (
          <div className="h-96">
            <PropertyLocationMap
              property={sampleProperty}
              height="100%"
              zoom={15}
              showPopup={true}
            />
          </div>
        );

      case 'search':
        return (
          <div className="space-y-4">
            <MapSearchBox
              onLocationSelect={handleLocationSelect}
              placeholder="Search for any location..."
            />
            <div className="h-80">
              <InteractiveMap
                properties={[sampleProperty]}
                height="100%"
                enableClustering={false}
              />
            </div>
          </div>
        );

      case 'controls':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative h-40 bg-beige-light dark:bg-brown rounded-lg">
                <MapControls
                  propertyCount={properties.length}
                  showSearchInArea={true}
                />
                <div className="flex items-center justify-center h-full">
                  <span className="text-brown dark:text-beige-medium">Desktop Controls</span>
                </div>
              </div>
              
              <div className="relative h-40 bg-beige-light dark:bg-brown rounded-lg">
                <CompactMapControls
                  propertyCount={properties.length}
                  currentView="map"
                />
                <div className="flex items-center justify-center h-full">
                  <span className="text-brown dark:text-beige-medium">Mobile Controls</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-40 bg-beige-light dark:bg-brown rounded-lg">
              <MapLegend />
              <div className="flex items-center justify-center h-full">
                <span className="text-brown dark:text-beige-medium">Map Legend</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Map Demo | UrbanEdge Real Estate</title>
        <meta name="description" content="Interactive map functionality demonstration for UrbanEdge Real Estate" />
      </Helmet>

      <div className="min-h-screen bg-beige-light dark:bg-brown py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-heading font-bold text-brown-dark dark:text-beige-light mb-4">
              Map Functionality Demo
            </h1>
            <p className="text-lg text-brown dark:text-beige-medium max-w-2xl mx-auto">
              Explore the interactive map features built for UrbanEdge Real Estate. 
              Test geocoding, property markers, clustering, and responsive controls.
            </p>
          </div>

          {/* Demo Mode Selector */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {demoModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setDemoMode(mode.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    demoMode === mode.id
                      ? 'bg-taupe text-white'
                      : 'bg-white dark:bg-brown-dark text-brown-dark dark:text-beige-light hover:bg-beige-medium dark:hover:bg-brown'
                  }`}
                >
                  {mode.name}
                </button>
              ))}
            </div>
            
            <div className="text-center mt-2">
              <p className="text-sm text-brown dark:text-beige-medium">
                {demoModes.find(m => m.id === demoMode)?.description}
              </p>
            </div>
          </div>

          {/* Demo Content */}
          <div className="bg-white dark:bg-brown-dark rounded-lg shadow-lg p-6 mb-8">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-taupe mx-auto mb-4"></div>
                  <p className="text-brown dark:text-beige-medium">Loading properties...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <p className="text-red-600 mb-4">Error: {error}</p>
                  <p className="text-brown dark:text-beige-medium">Using sample data for demo</p>
                </div>
              </div>
            ) : (
              renderDemo()
            )}
          </div>

          {/* Property Info */}
          {selectedProperty && (
            <div className="bg-white dark:bg-brown-dark rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-heading font-bold text-brown-dark dark:text-beige-light mb-4">
                Selected Property
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-brown-dark dark:text-beige-light">{selectedProperty.title}</h4>
                  <p className="text-brown dark:text-beige-medium">{selectedProperty.location}</p>
                  <p className="text-taupe font-bold">${selectedProperty.price?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-brown dark:text-beige-medium">
                    <strong>Coordinates:</strong> {selectedProperty.latitude}, {selectedProperty.longitude}
                  </p>
                  <p className="text-sm text-brown dark:text-beige-medium">
                    <strong>Bedrooms:</strong> {selectedProperty.bedrooms} | 
                    <strong> Bathrooms:</strong> {selectedProperty.bathrooms}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Test Section */}
          <div className="bg-white dark:bg-brown-dark rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-heading font-bold text-brown-dark dark:text-beige-light mb-4">
              Functionality Tests
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleRunTests}
                className="bg-taupe text-white px-6 py-2 rounded-lg hover:bg-brown transition-colors"
              >
                Run Map Tests
              </button>
              <p className="text-sm text-brown dark:text-beige-medium">
                Test geocoding, utilities, and map functions
              </p>
            </div>
            
            {testResults && (
              <div className="bg-gray-100 dark:bg-brown rounded-lg p-4">
                <pre className="text-xs text-gray-800 dark:text-beige-light whitespace-pre-wrap overflow-auto max-h-64">
                  {testResults}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MapDemoPage;
