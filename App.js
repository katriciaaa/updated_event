// App.js
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { initializeApp } from '@firebase/app';
import { getFirestore } from '@firebase/firestore';
import { app } from './firebase.tsx';
import { auth } from './firebase.tsx'; // Import the auth instance from firebase.tsx

// screens
import HomeScreen from './HomeScreen';
import AddEventScreen from './AddEventScreen';
import WelcomeScreen from './WelcomeScreen';
import MyProfileScreen from './MyProfileScreen';
import SettingsScreen from './SettingsScreen';
import EditEventScreen from './EditEventScreen'; // Import the EditEventScreen
import SearchScreen from './SearchScreen'; // Import the SearchScreen

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const App = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(''); // Shared state for username
  const [userPhone, setUserPhone] = useState(''); // Shared state for phone number
  const [profileImage, setProfileImage] = useState(null); // Shared state for profile image

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set the user state when authentication state changes
    });
    return () => unsubscribe();
  }, []);

  const addEvent = (event) => setEvents([...events, event]);

  const updateEvent = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const HomeWrapper = ({ navigation }) => <HomeScreen events={events} navigation={navigation} />;
  const AddEventWrapper = ({ navigation }) => <AddEventScreen addEvent={addEvent} navigation={navigation} />;

  const TabNavigator = () => (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeWrapper}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color="blue" size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Add Event"
        component={AddEventWrapper}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" color="blue" size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color="blue" size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="My Profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color="blue" size={24} />
          ),
        }}
      >
        {() => <MyProfileScreen userName={userName} userPhone={userPhone} profileImage={profileImage} setProfileImage={setProfileImage} />}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color="blue" size={24} />
          ),
        }}
      >
        {() => (
          <SettingsScreen
            userName={userName}
            setUserName={setUserName}
            userPhone={userPhone}
            setUserPhone={setUserPhone}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          options={{ headerShown: false }}
        >
          {(props) => <WelcomeScreen {...props} setUser={setUser} />}
        </Stack.Screen>
        <Stack.Screen
          name="HomeTabs"
          options={{ headerShown: false }}
        >
          {() => <TabNavigator />}
        </Stack.Screen>
        <Stack.Screen
          name="EditEventScreen"
          options={{ title: 'Edit Event' }}
        >
          {(props) => (
            <EditEventScreen {...props} updateEvent={updateEvent} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
