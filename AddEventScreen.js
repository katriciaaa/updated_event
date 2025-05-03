// AddEventScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Platform, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, addDoc } from '@firebase/firestore';
import { db } from './firebase.tsx';
import { getAuth } from '@firebase/auth';

const AddEventScreen = ({ addEvent, navigation }) => {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [description, setDescription] = useState('');
  const [invite, setInvite] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = async () => {
    const user = getAuth().currentUser; // Get the logged-in user
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create an event.');
      return;
    }

    if (title && eventType && date && time) {
      const combinedDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
      );

      const event = {
        title,
        eventType,
        date: combinedDateTime.toISOString(),
        description,
        invite,
        email: user.email, // Associate the event with the user's email
      };

      try {
        const docRef = await addDoc(collection(db, 'events'), event); // Save event to Firestore
        console.log('Event added with ID: ', docRef.id);

        addEvent({ ...event, id: docRef.id });

        // Reset form
        setTitle('');
        setEventType('');
        setDate(new Date());
        setTime(new Date());
        setDescription('');
        setInvite('');

        Alert.alert('Success', 'Event created successfully!');
        navigation.goBack(); // Navigate back to the previous screen
      } catch (error) {
        console.error('Error adding event: ', error);
        Alert.alert('Error', 'Failed to create the event.');
      }
    } else {
      Alert.alert('Error', 'Please fill in all the fields.');
    }
  };

  const formFields = [
    {
      key: 'title',
      component: (
        <>
          <Text style={styles.label}>Event Name:</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
          />
        </>
      ),
    },
    {
      key: 'eventType',
      component: (
        <>
          <Text style={styles.label}>Category:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={eventType}
              onValueChange={(itemValue) => setEventType(itemValue)}
            >
              <Picker.Item label="Select Event Type" value="" />
              <Picker.Item label="Wedding" value="wedding" />
              <Picker.Item label="Birthday" value="birthday" />
              <Picker.Item label="Anniversary" value="anniversary" />
              <Picker.Item label="School" value="school" />
              <Picker.Item label="Work" value="work" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </>
      ),
    },
    {
      key: 'date',
      component: (
        <>
          <Text style={styles.label}>Date:</Text>
          <Button
            title={date ? date.toDateString() : 'Select Date'}
            onPress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </>
      ),
    },
    {
      key: 'time',
      component: (
        <>
          <Text style={styles.label}>Time:</Text>
          <Button
            title={time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}
            onPress={() => setShowTimePicker(true)}
          />
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setTime(selectedTime);
                }
              }}
            />
          )}
        </>
      ),
    },
    {
      key: 'description',
      component: (
        <>
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
          />
        </>
      ),
    },
    {
      key: 'invite',
      component: (
        <>
          <Text style={styles.label}>Invite:</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={invite}
            onChangeText={setInvite}
            placeholder="Enter invite"
            multiline
          />
        </>
      ),
    },
    {
      key: 'submit',
      component: <Button title="Add Event" onPress={handleSubmit} />,
    },
  ];

  return (
    <FlatList
      data={formFields}
      renderItem={({ item }) => (
        <View style={styles.fieldWrapper}>
          <View style={styles.fieldContainer}>{item.component}</View>
        </View>
      )}
      keyExtractor={(item) => item.key}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  fieldWrapper: {
    paddingHorizontal: 16, // Add padding to the left and right of each field
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
});

export default AddEventScreen;