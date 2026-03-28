import React, { useState, useRef } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip'; // Tooltip library
import StepperTour from 'react-native-stepper-tour'; // Guided tour library

export default function DivyaDesamsApp() {
  // State for tooltips
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // State for stepper tour
  const [tourVisible, setTourVisible] = useState(true);

  // Refs for highlighted components
  const mapRef = useRef(null);
  const templeIconRef = useRef(null);

  // Steps for guided tour
  const steps = [
    {
      key: 'login',
      content: 'Welcome! Select your language to get started.',
      target: null, // no specific target on login page, could be null or login button ref
    },
    {
      key: 'map',
      content: 'Explore the map below. Tap temple icons to see temple details.',
      target: mapRef.current,
    },
    {
      key: 'templeIcon',
      content: 'Tap a temple icon to view timings and darshan info.',
      target: templeIconRef.current,
    },
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Language Selection (simulate after login) */}
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Select Language:</Text>
      <Button
        title="English"
        onPress={() => {
          setTooltipVisible(true); // Show tooltip after language selection
          setTourVisible(false); // Hide guided tour after completion
        }}
      />

      {/* Tooltip guiding map usage */}
      <Tooltip
        isVisible={tooltipVisible}
        content={<Text>Tap temple icons on the map to learn more about each temple.</Text>}
        placement="bottom"
        onClose={() => setTooltipVisible(false)}
        showChildInTooltip={false}
        topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
      >
        {/* Map container with ref for guided tour */}
        <View
          ref={mapRef}
          style={{ height: 300, marginTop: 20, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>Map Screen (placeholder)</Text>
          {/* Temple Icon */}
          <TouchableOpacity
            ref={templeIconRef}
            style={{ width: 50, height: 50, backgroundColor: 'orange', borderRadius: 25, marginTop: 20 }}
            onPress={() => alert('Show temple details card')}
          >
            <Text style={{ textAlign: 'center', lineHeight: 50 }}>T</Text>
          </TouchableOpacity>
        </View>
      </Tooltip>

      {/* Stepper Tour for initial onboarding */}
      {tourVisible && (
        <StepperTour
          steps={steps}
          isOpen={tourVisible}
          onFinish={() => setTourVisible(false)}
          currentStep={0}
          onCancel={() => setTourVisible(false)}
          arrowColor="#ff6600"
        />
      )}
    </View>
  );
}
