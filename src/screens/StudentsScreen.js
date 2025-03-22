import React, {useState} from 'react';
import {View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';

const StudentsScreen = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState('');

  const addStudent = () => {
    if (newStudent.trim() === '') return;
    
    // Check if student already exists (case insensitive)
    if (!students.some(student => 
      student.toLowerCase() === newStudent.trim().toLowerCase())) {
      setStudents([...students, newStudent.trim()]);
      setNewStudent('');
    } else {
      alert('This student already exists!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newStudent}
          onChangeText={setNewStudent}
          placeholder="Enter student name"
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addStudent}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.studentItem}>
            <Text style={styles.studentName}>{item}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No students added yet</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  studentItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  studentName: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#888',
    fontSize: 16,
  },
});

export default StudentsScreen;
