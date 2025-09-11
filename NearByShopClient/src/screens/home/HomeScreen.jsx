import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Location from 'expo-location';
import { setUserLocation } from '../../store/slices/globalSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchBar from '../../components/SearchBar';
import CategoryList from '../../components/CategoryList';
import ProductCard from '../../components/ProductCard';
import LoadingIndicator from '../../components/LoadingIndicator';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userLocation } = useSelector((state) => state.global);
  
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Sample categories data
  const sampleCategories = [
    { id: '1', name: 'Groceries', icon: 'food-apple' },
    { id: '2', name: 'Fashion', icon: 'tshirt-crew' },
    { id: '3', name: 'Electronics', icon: 'cellphone' },
    { id: '4', name: 'Furniture', icon: 'sofa' },
    { id: '5', name: 'Toys', icon: 'toy-brick' },
  ];

  // Sample products data
  const sampleProducts = [
    { id: '1', name: 'Fresh Apples', price: '₹120', image: 'https://via.placeholder.com/150', category: '1' },
    { id: '2', name: 'Men\'s T-Shirt', price: '₹599', image: 'https://via.placeholder.com/150', category: '2' },
    { id: '3', name: 'Smartphone', price: '₹15,999', image: 'https://via.placeholder.com/150', category: '3' },
    { id: '4', name: 'Sofa Set', price: '₹24,999', image: 'https://via.placeholder.com/150', category: '4' },
    { id: '5', name: 'Building Blocks', price: '₹899', image: 'https://via.placeholder.com/150', category: '5' },
  ];

  useEffect(() => {
    // Load categories and products
    setCategories(sampleCategories);
    setProducts(sampleProducts);
    
    // Get user location
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      setIsLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Location permission denied');
        setIsLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Get address from coordinates
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      const address = addressResponse[0];
      const locationName = address.name || 
                          `${address.street || ''}, ${address.city || ''}`;
      
      dispatch(setUserLocation({
        coordinates: { latitude, longitude },
        address: locationName,
      }));
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Reload data
    setCategories(sampleCategories);
    setProducts(sampleProducts);
    await getUserLocation();
    setRefreshing(false);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        {/* Header with location */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Icon name="map-marker" size={24} color="#3498db" />
            <Text style={styles.locationText} numberOfLines={1}>
              {userLocation?.address || 'Loading location...'}
            </Text>
            <TouchableOpacity onPress={getUserLocation}>
              <Icon name="refresh" size={20} color="#3498db" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.notificationIcon}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="bell-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar 
          placeholder="Search for products, shops, etc."
          onPress={() => navigation.navigate('Search')}
        />

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Categories */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <CategoryList 
              categories={categories} 
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </View>

          {/* Products */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name || 'Products'
                : 'All Products'}
            </Text>
            <View style={styles.productsGrid}>
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onPress={() => handleProductPress(product)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {isLoading && <LoadingIndicator />}
      </View>
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 4,
    marginRight: 8,
    flex: 1,
  },
  notificationIcon: {
    padding: 4,
  },
  sectionContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;