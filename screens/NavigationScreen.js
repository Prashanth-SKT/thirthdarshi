import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  NavigationView,
  TravelMode,
  RouteStatus,
  useNavigation,
} from "@googlemaps/react-native-navigation-sdk";

/**
 * For more into u can check https://github.com/googlemaps/react-native-navigation-sdk/tree/main/example
 */
const NavigationScreen = ({ navigation, route }) => {
  const { coords, name } = route.params;
  const [mapViewController, setMapViewController] = useState(null);
  const [navigationViewController, setNavigationViewController] =
    useState(null);
  const [navigationInitialized, setNavigationInitialized] = useState(false);
  const { navigationController, addListeners, removeListeners } =
    useNavigation();
  const onMapReady = useCallback(async () => {
    console.log("Map is ready, initializing navigator...");
    try {
      await navigationController.init();
    } catch (error) {
      console.error("Error initializing navigator", error);
    }
  }, [navigationController]);

  // single destination:
  const initWaypoint = async () => {
    if (!coords?.latitude || !coords?.longitude) {
      Alert.alert("Set lat lng values first");
      return;
    }
    const waypoint = {
      title: name,
      position: {
        lat: Number(coords.latitude),
        lng: Number(coords.longitude),
      },
    };

    const routingOptions = {
      travelMode: TravelMode.DRIVING,
      avoidFerries: true,
      avoidTolls: false,
    };

    const displayOptions = {
      showDestinationMarkers: true,
      showStopSigns: true,
      showTrafficLights: true,
    };

    navigationController.setDestination(
      waypoint,
      routingOptions,
      displayOptions
    );
    navigationController.startGuidance();
  };

  const onArrival = useCallback(
    (event) => {
      if (event.isFinalDestination) {
        console.log("Final destination reached");
        navigationController.stopGuidance();
        navigation.navigate("TempleSearch");
      } else {
        console.log("Continuing to the next destination");
        navigationController.continueToNextDestination();
        navigationController.startGuidance();
      }
    },
    [navigationController]
  );

  //all callbacks
  const mapViewCallbacks = useMemo(() => {
    return {
      onMapReady,
    };
  }, [mapViewController, onMapReady]);

  const onRecenterButtonClick = useCallback(() => {
    console.log("onRecenterButtonClick");
  }, []);

  const navigationViewCallbacks = {
    onRecenterButtonClick,
  };

  const onNavigationReady = useCallback(() => {
    console.log("onNavigationReady");
    setNavigationInitialized(true);
    initWaypoint();
  }, []);

  const onNavigationDispose = useCallback(async () => {
    await navigationViewController?.setNavigationUIEnabled(false);
    setNavigationInitialized(false);
  }, [navigationViewController]);

  const disposeNavigation = async () => {
    try {
      await navigationController.cleanup();
      if (onNavigationDispose) {
        onNavigationDispose();
      }
    } catch (e) {
      console.error("Error cleaning up navigation controller:", e);
    }
  };

  const navigationCallbacks = useMemo(
    () => ({
      onArrival,
      onNavigationReady,
      // Add other callbacks here
    }),
    [onArrival, onNavigationReady]
  );

  useEffect(() => {
    addListeners(navigationCallbacks);
    return () => {
      removeListeners(navigationCallbacks);
    };
  }, [navigationCallbacks, addListeners, removeListeners]);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        // if (!hasUnsavedChanges) {
        //   return;
        // }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          "Do you want to stop?",
          "Are you sure to stop navigation and leave the screen?",
          [
            {
              text: "Don't stop",
              style: "cancel",
              onPress: () => {
                // Do nothing
              },
            },
            {
              text: "Stop",
              style: "destructive",
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: async () => {
                navigationController.stopGuidance();
                navigationController.clearDestinations();
                await disposeNavigation();
                navigation.dispatch(e.data.action);
              },
            },
          ]
        );
      }),
    [navigation, navigationController]
  );

  return (
    <View style={styles.container}>
      <NavigationView
        style={[
          {
            ...styles.map_view,
          },
        ]}
        androidStylingOptions={{
          primaryDayModeThemeColor: "#34eba8",
          headerDistanceValueTextColor: "#76b5c5",
          headerInstructionsFirstRowTextSize: "20f",
        }}
        iOSStylingOptions={{
          navigationHeaderPrimaryBackgroundColor: "#34eba8",
          navigationHeaderDistanceValueTextColor: "#76b5c5",
        }}
        navigationViewCallbacks={navigationViewCallbacks}
        mapViewCallbacks={mapViewCallbacks}
        onMapViewControllerCreated={setMapViewController}
        onNavigationViewControllerCreated={setNavigationViewController}
      />

      {!navigationInitialized && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Initializing Navigation...</Text>
        </View>
      )}
    </View>
  );
};

export default NavigationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map_view: {
    flex: 1,
    color: "transparent",
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
  },
});
