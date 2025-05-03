import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, TouchableOpacity, TextInput } from 'react-native';
import { getAuth, signOut, sendPasswordResetEmail, updateProfile } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, getDoc, setDoc } from '@firebase/firestore';

const SettingsScreen = ({ userName, setUserName, userPhone, setUserPhone }) => {
  const navigation = useNavigation();
  const auth = getAuth();
  const db = getFirestore();
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email);

        // Retrieve phone number from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserPhone(userDoc.data().phone || 'N/A');
        } else {
          setUserPhone('N/A');
        }
      } else {
        Alert.alert('No user is currently signed in.');
      }
    };

    fetchUserData();
  }, []);

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
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image: ', error);
      Alert.alert('Error', 'Failed to pick an image.');
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        Alert.alert('Signed out successfully');
        navigation.navigate('Welcome');
      })
      .catch((error) => {
        Alert.alert('Error signing out', error.message);
      });
  };

  const handleChangePassword = () => {
    if (auth.currentUser?.email) {
      sendPasswordResetEmail(auth, auth.currentUser.email)
        .then(() => {
          Alert.alert('Password reset email sent');
        })
        .catch((error) => {
          Alert.alert('Error sending password reset email', error.message);
        });
    }
  };

  const handleUpdateUserName = async () => {
    if (!newUserName.trim()) {
      Alert.alert('Error', 'Username cannot be empty.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName: newUserName });
        setUserName(newUserName); // Update the shared username state
        Alert.alert('Success', 'Username updated successfully!');
        setNewUserName(''); // Clear the input field
      }
    } catch (error) {
      console.error('Error updating username: ', error);
      Alert.alert('Error', 'Failed to update username.');
    }
  };

  const handleUpdateUserPhone = async () => {
    if (!newUserPhone.trim()) {
      Alert.alert('Error', 'Phone number cannot be empty.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        // Update phone number in Firestore
        await setDoc(doc(db, 'users', user.uid), { phone: newUserPhone }, { merge: true });
        setUserPhone(newUserPhone); // Update the shared phone number state
        Alert.alert('Success', 'Phone number updated successfully!');
        setNewUserPhone(''); // Clear the input field
      }
    } catch (error) {
      console.error('Error updating phone number: ', error);
      Alert.alert('Error', 'Failed to update phone number.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleChoosePhoto} style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Text style={styles.placeholderText}>+</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.header}>Account Information:</Text>
      <View style={styles.userInfoRow}>
        <Text style={styles.userInfoLabel}>User Email:</Text>
        <Text style={styles.userInfoValue}>{userEmail}</Text>
      </View>
      <View style={styles.userInfoRow}>
        <Text style={styles.userInfoLabel}>User Phone:</Text>
        <Text style={styles.userInfoValue}>{userPhone}</Text>
      </View>
      <View style={styles.userInfoRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter new phone number"
          value={newUserPhone}
          onChangeText={setNewUserPhone}
          keyboardType="phone-pad"
        />
        <Button title="Update Phone Number" onPress={handleUpdateUserPhone} />
      </View>
      <View style={styles.userInfoRow}>
        <Text style={styles.userInfoLabel}>User Name:</Text>
        <Text style={styles.userInfoValue}>{userName}</Text>
      </View>
      <View style={styles.userInfoRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter new username"
          value={newUserName}
          onChangeText={setNewUserName}
        />
        <Button title="Update Username" onPress={handleUpdateUserName} />
      </View>
      <View style={styles.userInfoRow}>
        <Text style={styles.userInfoLabel}>Password:</Text>
        <Button title="Change Password" onPress={handleChangePassword} />
      </View>
      <View style={styles.signOutButton}>
        <Button title="Sign Out" onPress={handleSignOut} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 90,
    backgroundColor: '#ADD8E6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  placeholderText: {
    fontSize: 24,
    color: '#888',
  },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userInfoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfoValue: {
    fontSize: 18,
    textAlign: 'right',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  signOutButton: {
    alignSelf: 'center',
    width: '80%',
  },
});

export default SettingsScreen;