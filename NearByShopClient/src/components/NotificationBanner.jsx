import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationBanner = ({ 
  message, 
  type = 'info', // 'info', 'success', 'warning', 'error'
  duration = 3000, 
  onClose 
}) => {
  const [slideAnim] = useState(new Animated.Value(-100));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Slide in animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto hide after duration
    const timer = setTimeout(() => {
      hideNotification();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const hideNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      if (onClose) onClose();
    });
  };

  if (!visible) return null;

  // Define icon and colors based on notification type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#d4edda',
          borderColor: '#c3e6cb',
          textColor: '#155724',
          icon: 'check-circle',
        };
      case 'warning':
        return {
          backgroundColor: '#fff3cd',
          borderColor: '#ffeeba',
          textColor: '#856404',
          icon: 'alert',
        };
      case 'error':
        return {
          backgroundColor: '#f8d7da',
          borderColor: '#f5c6cb',
          textColor: '#721c24',
          icon: 'close-circle',
        };
      case 'info':
      default:
        return {
          backgroundColor: '#d1ecf1',
          borderColor: '#bee5eb',
          textColor: '#0c5460',
          icon: 'information',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: typeStyles.backgroundColor,
          borderColor: typeStyles.borderColor,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <View style={styles.content}>
        <Icon name={typeStyles.icon} size={20} color={typeStyles.textColor} style={styles.icon} />
        <Text style={[styles.message, { color: typeStyles.textColor }]}>{message}</Text>
      </View>
      <TouchableOpacity onPress={hideNotification} style={styles.closeButton}>
        <Icon name="close" size={16} color={typeStyles.textColor} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  message: {
    fontSize: 14,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
});

export default NotificationBanner;