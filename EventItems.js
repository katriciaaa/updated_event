// EventItems.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EventItems({ event }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{event.date}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.invite}>{event.invite}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    color: '#666',
    marginBottom: 5,
  },
  description: {
    color: '#333',
  },
  invite: {
    color: '#3498db',
    marginTop: 5,
  },
});