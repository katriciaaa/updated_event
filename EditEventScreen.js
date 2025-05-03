import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, FlatList, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc } from '@firebase/firestore';
import { db } from './firebase'; // Import Firestore instance

const EditEventScreen = ({ route, navigation, updateEvent }) => {
  const { event } = route.params;

  const [title, setTitle] = useState(event.title);
  const [eventType, setEventType] = useState(event.eventType);
  const [date, setDate] = useState(new Date(event.date));
  const [time, setTime] = useState(new Date(event.date));
  const [description, setDescription] = useState(event.description);
  const [invite, setInvite] = useState(event.invite);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = async () => {
    const updatedEvent = {
      ...event,
      title,
      eventType,
      date: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
      ).toISOString(),
      description,
      invite,
    };

    try {
      // Update the event in Firestore
      const eventRef = doc(db, 'events', event.id);
      await updateDoc(eventRef, updatedEvent);

      Alert.alert('Success', 'Event updated successfully!');
      navigation.goBack(); // Navigate back to HomeScreen
    } catch (error) {
      console.error('Error updating event: ', error);
      Alert.alert('Error', 'Failed to update the event.');
    }
  };

  return (
    <FlatList
      data={[
        {
          key: 'title',
          component: (
            <>
              <Text style={styles.label}>Event Title:</Text>
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
              <Text style={styles.label}>Event Type:</Text>
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
              <Text style={styles.label}>Event Date:</Text>
              <Button
                title={date ? date.toDateString() : 'Select Date'}
                onPress={() => setShowDatePicker(true)}
              />
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
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
              <Text style={styles.label}>Event Time:</Text>
              <Button
                title={time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}
                onPress={() => setShowTimePicker(true)}
              />
              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="default"
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
          key: 'save',
          component: <Button title="Save Changes" onPress={handleSave} />,
        },
      ]}
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

export default EditEventScreen;