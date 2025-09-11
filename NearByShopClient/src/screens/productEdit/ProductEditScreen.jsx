import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import ImagePicker from '../../components/ImagePicker';
import LoadingIndicator from '../../components/LoadingIndicator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProductEditScreen = ({ navigation, route }) => {
  const { shopUid } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });

  const handleInputChange = (field, value) => {
    setProductData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageSelected = (imageFile) => {
    setProductData(prev => ({
      ...prev,
      image: imageFile,
    }));
  };

  const validateForm = () => {
    if (!productData.name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return false;
    }
    if (!productData.price.trim()) {
      Alert.alert('Error', 'Product price is required');
      return false;
    }
    if (!productData.category.trim()) {
      Alert.alert('Error', 'Product category is required');
      return false;
    }
    if (!productData.image) {
      Alert.alert('Error', 'Product image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('file', productData.image);
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('shopUid', shopUid);

      // In a real app, you would send this to your API
      // const response = await uploadProductApi(formData);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          'Success',
          'Product uploaded successfully',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to upload product');
      console.error('Error uploading product:', error);
    }
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
          <Text style={styles.headerTitle}>Add Product</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {/* Product Image */}
            <ImagePicker 
              onImageSelected={handleImageSelected} 
              label="Product Image"
            />

            {/* Product Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={styles.input}
                value={productData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter product name"
              />
            </View>

            {/* Product Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={productData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder="Enter product description"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Product Price */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                value={productData.price}
                onChangeText={(text) => handleInputChange('price', text)}
                placeholder="Enter product price"
                keyboardType="numeric"
              />
            </View>

            {/* Product Category */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                value={productData.category}
                onChangeText={(text) => handleInputChange('category', text)}
                placeholder="Enter product category"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Upload Product</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {isLoading && <LoadingIndicator />}
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
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputContainer: {
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
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductEditScreen;