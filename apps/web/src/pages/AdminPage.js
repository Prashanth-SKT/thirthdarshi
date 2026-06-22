import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from "../firebaseAuth";

const AdminPage = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState('temples');
  const [fields, setFields] = useState([]); // dynamic fields

  const collectionOptions = [
    'temples',
    'search_tags',
    'temple_sevas',
    'temple_timings',
    'temple_details',
  ];

  // ✅ Flatten nested objects (for display)
  const flattenObject = (obj, parentKey = '', res = {}) => {
    for (const key in obj) {
      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        flattenObject(obj[key], `${parentKey}${key}.`, res);
      } else {
        res[`${parentKey}${key}`] = obj[key];
      }
    }
    return res;
  };

  // 🔥 Fetch records of the selected collection
  const fetchCollectionRecords = async (colName) => {
    try {
      const snapshot = await getDocs(collection(db, colName));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecords(data);

      // Set dynamic fields based on first record
      if (data.length > 0) {
        const flatKeys = Object.keys(flattenObject(data[0])).filter(
          (key) => key !== 'id'
        );
        setFields(flatKeys);
      } else {
        setFields([]); // no data, so fields are empty
      }
    } catch (err) {
      console.error(`🔥 Failed to fetch ${colName}:`, err);
    }
  };

  useEffect(() => {
    fetchCollectionRecords(selectedCollection);
  }, [selectedCollection]);

  const handleSubmit = async () => {
    const cleanForm = Object.fromEntries(
      Object.entries(form).filter(([_, v]) => v !== '' && v != null)
    );

    try {
      if (editingId) {
        // 📝 Update document
        await updateDoc(doc(db, selectedCollection, editingId), cleanForm);
        alert('✅ Record updated');
      } else {
        // ➕ Add new document
        await addDoc(collection(db, selectedCollection), cleanForm);
        alert('✅ Record added');
      }
      setForm({});
      setEditingId(null);
      fetchCollectionRecords(selectedCollection);
    } catch (err) {
      console.error('🔥 Error in handleSubmit:', err);
      alert(err.message);
    }
  };

  const handleEdit = (record) => {
    const flatRecord = flattenObject(record);
    setForm(flatRecord);
    setEditingId(record.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteDoc(doc(db, selectedCollection, id));
        alert('🗑️ Deleted');
        fetchCollectionRecords(selectedCollection);
      } catch (err) {
        console.error('🔥 Delete failed:', err);
        alert('Failed to delete record.');
      }
    }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const parsed = Papa.parse(text, { header: true });

    let added = 0;
    for (const row of parsed.data) {
      if (Object.values(row).some((v) => v)) {
        await addDoc(collection(db, selectedCollection), row);
        added++;
      }
    }

    alert(`📄 ${added} rows added to ${selectedCollection}`);
    fetchCollectionRecords(selectedCollection);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>

      {/* 🔘 Select collection */}
      <div style={{ margin: '10px 0' }}>
        <label>
          <strong>Select Collection:</strong>
        </label>
        <br />
        {collectionOptions.map((col) => (
          <label key={col} style={{ marginRight: 10 }}>
            <input
              type="radio"
              name="collection"
              value={col}
              checked={selectedCollection === col}
              onChange={() => {
                setSelectedCollection(col);
                setForm({});
                setEditingId(null);
              }}
            />
            {col}
          </label>
        ))}
      </div>

      {/* 📝 Form */}
      <h3>{editingId ? 'Edit Record' : 'Add New Record'}</h3>
      {fields.map((key) => (
        <div key={key} style={{ marginBottom: 10 }}>
          <input
            placeholder={key}
            value={form[key] ?? ''}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                [key]: e.target.value,
              }))
            }
            style={{ width: '300px', padding: 8 }}
          />
        </div>
      ))}

      <button onClick={handleSubmit} style={{ marginRight: 10 }}>
        {editingId ? 'Update' : 'Add'}
      </button>

      {/* 📄 Upload CSV */}
      <label style={{ display: 'block', marginTop: 20 }}>
        <strong>Upload CSV File:</strong>
        <input type="file" accept=".csv" onChange={handleCSVUpload} />
      </label>

      {/* 📋 Records */}
      <h3 style={{ marginTop: 30 }}>Records in {selectedCollection}</h3>
      {records.map((item) => {
        const flatItem = flattenObject(item);

        return (
          <div
            key={item.id}
            style={{
              borderBottom: '1px solid #ccc',
              padding: 10,
              marginBottom: 8,
              backgroundColor: '#f9f9f9',
              borderRadius: 6,
            }}
          >
            {Object.entries(flatItem).map(([key, value]) => (
              key !== 'id' && (
                <div key={key}>
                  <strong>{key}:</strong> {value}
                </div>
              )
            ))}

            <div style={{ marginTop: 6 }}>
              <button
                onClick={() => handleEdit(item)}
                style={{ marginRight: 8, padding: '4px 8px' }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  color: 'white',
                  backgroundColor: 'red',
                  border: 'none',
                  padding: '4px 8px',
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminPage;
