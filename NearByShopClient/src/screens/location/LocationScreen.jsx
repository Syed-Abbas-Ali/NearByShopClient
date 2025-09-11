import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomMap from '../../components/CustomMap';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLocation } from '../../store/slices/globalSlice';

const LocationScreen = ({ navigation, route }) => {
  const { onLocationSelect } = route.params || {};
  const userLocation = useSelector(state => state.global.userLocation);
  const dispatch = useDispatch();
  
  const [selectedLocation, setSelectedLocation] = useState(userLocation || null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (userLocation && !selectedLocation) {
      setSelectedLocation(userLocation);
    }
  }, [userLocation]);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    // In a real app, you would use a geocoding service to get the address from coordinates
    // For example: reverseGeocode(location.latitude, location.longitude)
    setAddress('Selected location');
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location on the map');
      return;
    }

    // Update global state
    dispatch(setUserLocation(selectedLocation));

    // Pass back to the calling screen if callback provided
    if (onLocationSelect) {
      onLocationSelect({
        ...selectedLocation,
        address: address,
      });
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Location</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <CustomMap
            initialLocation={selectedLocation ? {
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            } : null}
            onLocationChange={handleLocationChange}
            height={400}
          />
        </View>

        {/* Address Input */}
        <View style={styles.addressContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address or select on map"
            multiline
          />
        </View>

        {/* Instructions */}
        <Text style={styles.instructions}>
          Tap on the map to select a location or drag the marker to adjust
        </Text>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  mapContainer: {
    padding: 16,
  },
  addressContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  instructions: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  confirmButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationScreen;