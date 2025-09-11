import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import LoadingIndicator from '../../components/LoadingIndicator';
import ProductCard from '../../components/ProductCard';

const ShopScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { shopId } = route.params || {};
  const [isLoading, setIsLoading] = useState(true);
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    fetchShopData();
  }, [shopId]);

  const fetchShopData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setShopData({
        id: shopId || '123',
        name: 'Sample Shop',
        description: 'This is a sample shop description. We sell high-quality products at affordable prices.',
        address: '123 Main Street, City, Country',
        phone: '+1 234 567 8900',
        email: 'shop@example.com',
        rating: 4.5,
        reviewCount: 120,
        image: 'https://via.placeholder.com/150',
        coverImage: 'https://via.placeholder.com/500x200',
        isVerified: true,
        followers: 256,
      });
      
      setProducts([
        {
          id: '1',
          name: 'Product 1',
          price: 19.99,
          image: 'https://via.placeholder.com/150',
          rating: 4.2,
          reviewCount: 45,
        },
        {
          id: '2',
          name: 'Product 2',
          price: 29.99,
          image: 'https://via.placeholder.com/150',
          rating: 4.5,
          reviewCount: 32,
        },
        {
          id: '3',
          name: 'Product 3',
          price: 39.99,
          image: 'https://via.placeholder.com/150',
          rating: 4.0,
          reviewCount: 28,
        },
        {
          id: '4',
          name: 'Product 4',
          price: 49.99,
          image: 'https://via.placeholder.com/150',
          rating: 4.8,
          reviewCount: 56,
        },
      ]);
    } catch (error) {
      console.error('Error fetching shop data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactShop = () => {
    // Navigate to chat with shop
    navigation.navigate('ChatTab', { shopId: shopData.id, shopName: shopData.name });
  };

  const handleProductPress = (productId) => {
    navigation.navigate('ProductDetails', { productId });
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!shopData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={60} color="#dc3545" />
          <Text style={styles.errorText}>Shop not found</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backIconContainer} 
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{shopData.name}</Text>
          <TouchableOpacity style={styles.shareIconContainer}>
            <Icon name="share-variant" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Shop Cover Image */}
        <View style={styles.coverImageContainer}>
          <Image 
            source={{ uri: shopData.coverImage }} 
            style={styles.coverImage} 
            resizeMode="cover"
          />
        </View>

        {/* Shop Info */}
        <View style={styles.shopInfoContainer}>
          <View style={styles.shopImageContainer}>
            <Image 
              source={{ uri: shopData.image }} 
              style={styles.shopImage} 
              resizeMode="cover"
            />
            {shopData.isVerified && (
              <View style={styles.verifiedBadge}>
                <Icon name="check-circle" size={16} color="#fff" />
              </View>
            )}
          </View>

          <View style={styles.shopDetails}>
            <View style={styles.shopNameRow}>
              <Text style={styles.shopName}>{shopData.name}</Text>
              {shopData.isVerified && (
                <Icon name="check-decagram" size={18} color="#3498db" style={styles.verifiedIcon} />
              )}
            </View>

            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#ffc107" />
              <Text style={styles.ratingText}>{shopData.rating}</Text>
              <Text style={styles.reviewCount}>({shopData.reviewCount} reviews)</Text>
            </View>

            <View style={styles.followersContainer}>
              <Icon name="account-group" size={16} color="#666" />
              <Text style={styles.followersText}>{shopData.followers} followers</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.contactButton}
            onPress={handleContactShop}
          >
            <Icon name="chat" size={16} color="#fff" />
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Shop Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About</Text>
          <Text style={styles.descriptionText}>{shopData.description}</Text>
        </View>

        {/* Shop Contact Info */}
        <View style={styles.contactInfoContainer}>
          <View style={styles.contactInfoItem}>
            <Icon name="map-marker" size={18} color="#666" />
            <Text style={styles.contactInfoText}>{shopData.address}</Text>
          </View>
          <View style={styles.contactInfoItem}>
            <Icon name="phone" size={18} color="#666" />
            <Text style={styles.contactInfoText}>{shopData.phone}</Text>
          </View>
          <View style={styles.contactInfoItem}>
            <Icon name="email" size={18} color="#666" />
            <Text style={styles.contactInfoText}>{shopData.email}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'products' && styles.activeTab]}
            onPress={() => setActiveTab('products')}
          >
            <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>Products</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <View style={styles.productsContainer}>
            <FlatList
              data={products}
              renderItem={({ item }) => (
                <View style={styles.productCardWrapper}>
                  <ProductCard 
                    product={item} 
                    onPress={() => handleProductPress(item.id)}
                  />
                </View>
              )}
              keyExtractor={item => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.productGrid}
            />
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.reviewsContainer}>
            <Text style={styles.comingSoonText}>Reviews coming soon</Text>
          </View>
        )}

        {activeTab === 'about' && (
          <View style={styles.aboutContainer}>
            <Text style={styles.comingSoonText}>Additional information coming soon</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  backIconContainer: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  shareIconContainer: {
    padding: 8,
  },
  coverImageContainer: {
    width: '100%',
    height: 150,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  shopInfoContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  shopImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
  },
  shopImage: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3498db',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  shopNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 4,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666666',
  },
  followersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followersText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  contactInfoContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactInfoText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: '500',
  },
  productsContainer: {
    padding: 8,
    backgroundColor: '#ffffff',
  },
  productCardWrapper: {
    width: '50%',
    padding: 8,
  },
  productGrid: {
    paddingBottom: 16,
  },
  reviewsContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  aboutContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666666',
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333333',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ShopScreen;