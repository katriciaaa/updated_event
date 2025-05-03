// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Button, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { db } from './firebase';  // Import db from App.js
import { collection, getDocs, deleteDoc, doc, query, where } from '@firebase/firestore';
import { getAuth } from '@firebase/auth';
import EventItems from './EventItems';
import EditEventScreen from './EditEventScreen';
import { createStackNavigator, NavigationContainer } from '@react-navigation/stack';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="EditEventScreen"
          component={EditEventScreen}
          options={{ title: 'Edit Event' }} // Optional: Customize the header title
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export { AppNavigator };

const HomeScreen = ({ navigation }) => {
  const [firestoreEvents, setFirestoreEvents] = useState([]);

  // Fetch events from Firestore
  const fetchEvents = async () => {
    const user = getAuth().currentUser; // Get the logged-in user
    if (!user) {
      Alert.alert('Error', 'You must be logged in to view events.');
      return;
    }

    try {
      const q = query(
        collection(db, 'events'),
        where('email', '==', user.email) // Filter events by the user's email
      );
      const querySnapshot = await getDocs(q);
      const eventsList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Add the document ID
      }));
      setFirestoreEvents(eventsList); // Update state with the filtered events
    } catch (error) {
      console.error('Error fetching events: ', error);
      Alert.alert('Error', 'Failed to fetch events.');
    }
  };

  // Re-fetch events when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [])
  );

  const handleDeleteEvent = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this event?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'events', id)); // Delete the event from Firestore
              setFirestoreEvents((prevEvents) => prevEvents.filter((event) => event.id !== id)); // Update state
              Alert.alert('Success', 'Event deleted successfully!');
            } catch (e) {
              console.error('Error deleting event: ', e);
              Alert.alert('Error', 'Failed to delete the event.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditEvent = (item) => {
    console.log('Editing event:', item);
    navigation.navigate('EditEventScreen', { event: item }); // Navigate to EditEventScreen and pass the event as a parameter
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={firestoreEvents} // Use fetched events
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const eventDate = new Date(item.date); // Convert ISO string to Date object
          const formattedDate = eventDate.toDateString(); // Format date
          const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format time

          return (
            <View style={styles.eventContainer}>
              <View style={styles.eventRow}>
                <View>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventDate}>{formattedDate}</Text>
                  <Text style={styles.eventTime}>{formattedTime}</Text>
                  <Text style={styles.eventDescription}>{item.description}</Text>
                  <Text style={styles.eventInvite}>Invites: {item.invite}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <Button title="Edit" color="blue" onPress={() => handleEditEvent(item)} />
                  <Button title="Delete" color="red" onPress={() => handleDeleteEvent(item.id)} />
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No events yet. Add one!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 35, fontWeight: 'bold', marginBottom: 20 },
  eventContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 16,
    color: '#333',
  },
  eventTime: {
    fontSize: 16,
    color: '#555',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  eventInvite: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'left',
    marginTop: 0,
  },
});

export default HomeScreen;
