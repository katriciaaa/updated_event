import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Button, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from '@firebase/auth';

const MyProfileScreen = ({ userName, userPhone, profileImage, setProfileImage }) => {
  const [bio, setBio] = useState(''); // State for the bio

  const handleChoosePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'You need to allow access to your camera roll.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Crop the image to a square
        quality: 1, // High-quality image
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri); // Update the profile image state
      }
    } catch (error) {
      console.error('Error picking image: ', error);
      Alert.alert('Error', 'Failed to pick an image.');
    }
  };

  const handleAddBio = () => {
    Alert.prompt(
      'Add a Bio',
      'Enter your bio below:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Done',
          onPress: (text) => setBio(text), // Update the bio state
        },
      ],
      'plain-text',
      bio // Pre-fill with the current bio
    );
  };

  return (
    <FlatList
      data={[]} // Empty data since we are only using the header
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <View style={styles.container}>
          <TouchableOpacity onPress={handleChoosePhoto} style={styles.imageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Text style={styles.placeholderText}>+</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>{userName}</Text>
          {bio ? (
            <Text style={styles.bioText}>{bio}</Text>
          ) : (
            <Button title="Add Bio" onPress={handleAddBio} />
          )}
          <View style={styles.separator} />
          <Text style={styles.header}>Contact Info:</Text>
          <Text style={styles.label}>User Email: {getAuth().currentUser?.email}</Text>
          <Text style={styles.label}>User Phone: {userPhone}</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center', // Center content horizontally
  },
  imageContainer: {
    width: 220, // Increased size
    height: 220, // Increased size
    borderRadius: 140, // Half of width/height for a perfect circle
    backgroundColor: '#ADD8E6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 15, // Add spacing below the profile photo
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 80, // Match the borderRadius of the container
  },
  placeholderText: {
    fontSize: 40, // Adjusted font size for larger circle
    color: '#888',
  },
  userName: {
    fontSize: 42, // Adjusted font size for better proportion
    fontWeight: 'bold',
    textAlign: 'center', // Center the text
    marginBottom: 10, // Add spacing below the user name
  },
  bioText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20, // Add spacing below the bio text
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%', // Make the separator span the full width
    marginVertical: 20, // Spacing above and below the line
  },
  header: {
    fontSize: 25, // Slightly reduced font size
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center', // Center the header text
  },
  label: {
    fontSize: 18, // Increased font size for better readability
    color: '#555',
    marginBottom: 10, // Add spacing between labels
    textAlign: 'center', // Center the label text
  },
});

export default MyProfileScreen;