import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import StudentItem from '../components/StudentItem';
import {loadStudents, saveStudents} from '../utils/storage';

/**
 * Screen component for managing students
 */
const StudentsScreen = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState('');

  // Load saved students when component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  // Load students from storage
  const fetchStudents = async () => {
    try {
      const studentsList = await loadStudents();
      setStudents(studentsList);
    } catch (error) {
      Alert.alert('Error', 'Failed to load students');
    }
  };

  // Add a new student
  const addStudent = () => {
    if (newStudent.trim() === '') {
      return;
    }
    
    // Check if student already exists (case insensitive)
    if (!students.some(student => 
      student.toLowerCase() === newStudent.trim().toLowerCase())) {
      
      const updatedStudents = [...students, newStudent.trim()];
      setStudents(updatedStudents);
      saveStudents(updatedStudents)
        .then(() => setNewStudent(''))
        .catch(() => Alert.alert('Error', 'Failed to save student'));
    } else {
      Alert.alert('Error', 'This student already exists!');
    }
  };

  // Remove a student
  const removeStudent = (index) => {
    Alert.alert(
      'Confirm',
      `Are you sure you want to remove ${students[index]}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedStudents = students.filter((_, i) => i !== index);
            setStudents(updatedStudents);
            saveStudents(updatedStudents)
              .catch(() => Alert.alert('Error', 'Failed to remove student'));
          },
          style: 'destructive',
        },
      ],
    );
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
          returnKeyType="done"
          onSubmitEditing={addStudent}
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
        renderItem={({item, index}) => (
          <StudentItem
            name={item}
            onRemove={() => removeStudent(index)}
          />
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
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#888',
    fontSize: 16,
  },
});

export default StudentsScreen;