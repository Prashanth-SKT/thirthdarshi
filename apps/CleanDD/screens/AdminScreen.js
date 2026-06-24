import React, { useEffect, useState } from 'react';
import { Alert, FlatList, TextInput, View, Text, Button, TouchableOpacity, ScrollView } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import Papa from 'papaparse';


// import {
//   addTemple,
//   deleteTempleById,
//   getAllTemples,
//   updateTempleById,
//    uploadCSVToCollection
// } from '../../test/packages/api-client/firebaseController';

const initialForm = {
  name: '', city: '', state: '', deity: '', templeType: '',
  address: '', imageUrl: '', latitude: '', longitude: ''
};

const AdminScreen = () => {
  const [temples, setTemples] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    const data = await getAllTemples();
    setTemples(data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    const cleanForm = { ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude) };
    try {
      if (editingId) {
        await updateTempleById(editingId, cleanForm);
        Alert.alert("Success", "Record updated");
      } else {
        await addTemple(cleanForm);
        Alert.alert("Success", "Record added");
      }
      setForm(initialForm);
      setEditingId(null);
      fetchData();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const handleEdit = (temple) => {
    setForm({ ...temple });
    setEditingId(temple.id);
  };

  const handleDelete = (id) => {
    Alert.alert("Confirm", "Delete this record?", [
      { text: "Cancel" },
      {
        text: "Delete", onPress: async () => {
          await deleteTempleById(id);
          Alert.alert("Deleted");
          fetchData();
        }
      }
    ]);
  };

  const collectionOptions = [
  'temples',
  'search_tags',
  'temple_sevas',
  'temple_timings',
  'temple_details',
];

const [selectedCollection, setSelectedCollection] = useState('temples');

const handleCSVUpload = async () => {
  try {
    if (!selectedCollection) {
      Alert.alert("Select Collection", "Please choose a collection first.");
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
    if (result.canceled) return;

    const fileUri = result.assets[0].uri;
    const content = await FileSystem.readAsStringAsync(fileUri);
    const parsed = Papa.parse(content, { header: true });

    let added = 0;
    for (const row of parsed.data) {
      if (Object.values(row).some(v => v)) {
        await uploadCSVToCollection(selectedCollection, row);
        added++;
      }
    }

    Alert.alert("Success", `${added} rows added to ${selectedCollection}`);
    fetchData();
  } catch (e) {
    console.error(e);
    Alert.alert("Error", "CSV upload failed.");
  }
};


  return (
   <ScrollView contentContainerStyle={{ padding: 20 }}>

      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>Temple Form</Text>

      {Object.keys(initialForm).map(key => (
        <TextInput
          key={key}
          placeholder={key}
          value={form[key]}
          onChangeText={(val) => setForm(prev => ({ ...prev, [key]: val }))}
          style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
      ))}
      
<Text style={{ marginTop: 10, fontWeight: 'bold' }}>Select Collection:</Text>
{collectionOptions.map(col => (
  <TouchableOpacity
    key={col}
    onPress={() => setSelectedCollection(col)}
    style={{
      padding: 8,
      marginVertical: 4,
      backgroundColor: selectedCollection === col ? 'lightblue' : '#eee',
    }}
  >
    <Text>{col}</Text>
  </TouchableOpacity>
  
))}

      <Button title={editingId ? "Update" : "Add"} onPress={handleSubmit} />
      <View style={{ marginVertical: 10 }}>
        <Button title="Upload CSV File" onPress={handleCSVUpload} color="#228B22" />
      </View>

      <Text style={{ fontWeight: 'bold', fontSize: 18, marginVertical: 15 }}>Existing Temples</Text>
      <FlatList
        data={temples}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ borderBottomWidth: 1, marginVertical: 5 }}>
            <Text>{item.name} ({item.city})</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={{ marginRight: 10 }}>
                <Text style={{ color: 'blue' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={{ color: 'red' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
    
  );
};

export default AdminScreen;
