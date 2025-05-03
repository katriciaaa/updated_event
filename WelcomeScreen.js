import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, sendPasswordResetEmail } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, setDoc } from '@firebase/firestore';

const WelcomeScreen = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(''); // New state for the user's phone number
  const [isLogin, setIsLogin] = useState(true);
  const auth = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set the user in state
        navigation.navigate('HomeTabs'); // Navigate to HomeTabs after successful login
      }
    });
    return () => unsubscribe();
  }, [auth, navigation]);

  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        // Sign In logic (already implemented)
        if (!email.trim() || !email.includes('@')) {
          if (!password.trim() || password.length < 8) {
            Alert.alert('Error', 'Both email and password are incorrect.');
          } else {
            Alert.alert('Error', 'Invalid email address.');
          }
          return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
          Alert.alert('Error', 'Incorrect password.');
          return;
        }

        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in!');
      } else {
        // Sign Up logic
        if (!email.trim() || !password.trim() || !name.trim() || !phone.trim()) {
          Alert.alert('Error', 'Please fill in all fields correctly.');
          return;
        }

        if (!email.includes('@')) {
          Alert.alert('Error', 'Invalid email.');
          return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
          Alert.alert('Error', 'Meet password requirements.');
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update the user's profile with their name
        await updateProfile(user, { displayName: name });

        // Save the phone number to Firestore
        const db = getFirestore();
        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          phone,
        });

        console.log('User created with name:', name, 'and phone:', phone);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during authentication.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
      {!isLogin && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad" // Ensure the keyboard is optimized for phone numbers
          />
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {!isLogin && (
        <Text style={styles.passwordRequirements}>
          Password must be at least 8 characters long, include at least 1 uppercase letter, and 1 special character.
        </Text>
      )}
      <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} />
      {isLogin && (
        <Text
          style={styles.forgotPasswordText}
          onPress={() => {
            if (email.trim()) {
              sendPasswordResetEmail(auth, email)
                .then(() => {
                  Alert.alert('Password reset email sent');
                })
                .catch((error) => {
                  Alert.alert('Error', error.message);
                });
            } else {
              Alert.alert('Error', 'Please enter your email to reset your password.');
            }
          }}
        >
          Forgot Password?
        </Text>
      )}
      <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16, fontWeight: 'bold' }, // Added fontWeight: 'bold'
  input: { width: '80%', height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 16, paddingLeft: 8 },
  toggleText: { color: '#3498db', marginTop: 10 },
  forgotPasswordText: {
    color: '#3498db',
    marginTop: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  passwordRequirements: {
    color: '#888',
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default WelcomeScreen;