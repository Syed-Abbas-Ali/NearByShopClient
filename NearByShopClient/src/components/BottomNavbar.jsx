import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const BottomNavbar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('Home');
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    // Update active tab based on current route
    const routeName = route.name;
    if (routeName.includes('Home')) {
      setActiveTab('Home');
    } else if (routeName.includes('Search')) {
      setActiveTab('Search');
    } else if (routeName.includes('Chat')) {
      setActiveTab('Chat');
    } else if (routeName.includes('Wishlist')) {
      setActiveTab('Wishlist');
    } else if (routeName.includes('Profile')) {
      setActiveTab('Profile');
    }
  }, [route]);

  const handleNavigation = (screen) => {
    setActiveTab(screen);
    
    switch (screen) {
      case 'Home':
        navigation.navigate('HomeTab');
        break;
      case 'Search':
        navigation.navigate('SearchTab');
        break;
      case 'Chat':
        if (isAuthenticated) {
          navigation.navigate('ChatTab');
        } else {
          navigation.navigate('AuthStack');
        }
        break;
      case 'Wishlist':
        if (isAuthenticated) {
          navigation.navigate('WishlistTab');
        } else {
          navigation.navigate('AuthStack');
        }
        break;
      case 'Profile':
        if (isAuthenticated) {
          navigation.navigate('ProfileTab');
        } else {
          navigation.navigate('AuthStack');
        }
        break;
      default:
        navigation.navigate('HomeTab');
    }
  };

  const getTabIcon = (tabName, isActive) => {
    const color = isActive ? '#3498db' : '#888888';
    const size = 24;

    switch (tabName) {
      case 'Home':
        return <Icon name="home" size={size} color={color} />;
      case 'Search':
        return <Icon name="magnify" size={size} color={color} />;
      case 'Chat':
        return <Icon name="chat" size={size} color={color} />;
      case 'Wishlist':
        return <Icon name="heart" size={size} color={color} />;
      case 'Profile':
        return <Icon name="account" size={size} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {['Home', 'Search', 'Chat', 'Wishlist', 'Profile'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={styles.tabItem}
          onPress={() => handleNavigation(tab)}
          activeOpacity={0.7}
        >
          {getTabIcon(tab, activeTab === tab)}
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
    width: width,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
    color: '#888888',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: '500',
  },
});

export default BottomNavbar;