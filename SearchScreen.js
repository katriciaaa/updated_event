import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Add logic to filter or fetch search results based on the query
    const filteredResults = []; // Replace with actual search logic
    setResults(filteredResults);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search events..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.resultItem}>{item}</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 5,
  },
  resultItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
});

export default SearchScreen;