import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { setUserLocation } from '../store/slices/globalSlice';
import LoadingIndicator from './LoadingIndicator';

const CustomMap = ({ initialLocation, onLocationChange, height = 200 }) => {
  const [location, setLocation] = useState(initialLocation || null);
  const [isLoading, setIsLoading] = useState(!initialLocation);
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!initialLocation) {
      getCurrentLocation();
    }
  }, [initialLocation]);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show your current location on the map.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setLocation(newLocation);
      dispatch(setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));

      if (onLocationChange) {
        onLocationChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }

      // Animate to the user's location
      if (mapRef.current) {
        mapRef.current.animateToRegion(newLocation, 1000);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your current location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    
    const newLocation = {
      ...location,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    };
    
    setLocation(newLocation);
    
    if (onLocationChange) {
      onLocationChange({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    }
  };

  if (!location && isLoading) {
    return (
      <View style={[styles.container, { height }]}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : null}
          initialRegion={location}
          onPress={handleMapPress}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable
              onDragEnd={(e) => {
                const { coordinate } = e.nativeEvent;
                setLocation({
                  ...location,
                  latitude: coordinate.latitude,
                  longitude: coordinate.longitude,
                });
                
                if (onLocationChange) {
                  onLocationChange({
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                  });
                }
              }}
            />
          )}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default CustomMap;