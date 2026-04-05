import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Assuming Firestore is already initialized elsewhere in the app


const TeluguDisplayScreen = () => {
  const [teluguData, setTeluguData] = useState([]);

  useEffect(() => {
    const fetchTeluguData = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'yourCollection')); // Replace 'yourCollection' with your actual collection name
        const data = querySnapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            teColumn1: docData['Te. Column1'] || 'N/A', // Fetch Telugu Column1, fallback if missing
            teColumn2: docData['Te. Column2'] || 'N/A', // Fetch Telugu Column2, fallback if missing
          };
        });
        setTeluguData(data);
      } catch (error) {
        console.error('Error fetching Firestore data:', error);
      }
    };

    fetchTeluguData();
  }, []);

  return (
    <View style={styles.container}>
      {teluguData.length === 0 ? (
        <Text style={styles.loadingText}>Loading Telugu Data...</Text>
      ) : (
        teluguData.map(item => (
          <View key={item.id} style={styles.itemContainer}>
            <Text style={styles.text}>
              {item.teColumn1}
            </Text>
            <Text style={styles.text}>
              {item.teColumn2}
            </Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  itemContainer: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Gidugu' : 'Gidugu-Regular', // Use platform-specific font family
    fontSize: 18,
    color: '#000',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TeluguDisplayScreen;