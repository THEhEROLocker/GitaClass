import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

/**
 * Displays assignment summary for a selected date
 * @param {Object} props - Component props
 * @param {Array|string} props.assignments - Assignments for the selected date
 * @param {Function} props.onRemoveStudent - Function to remove a specific student
 */
const AssignmentSummary = ({assignments, onRemoveStudent}) => {
  // Handle no assignments
  if (!assignments) {
    return (
      <View style={styles.assignmentInfo}>
        <Text style={styles.noAssignment}>No students assigned for this date</Text>
      </View>
    );
  }
  
  // Handle legacy data format (single student string) or empty array
  if (!Array.isArray(assignments) || assignments.length === 0) {
    const studentName = Array.isArray(assignments) ? 'No one' : assignments;
    return (
      <View style={styles.assignmentInfo}>
        <Text style={styles.assignmentTitle}>Student Summary:</Text>
        <Text style={styles.assignmentStudent}>{studentName}</Text>
      </View>
    );
  }
  
  // Handle multiple students
  return (
    <View style={styles.assignmentInfo}>
      <Text style={styles.assignmentTitle}>
        Student Summary ({assignments.length}):
      </Text>
      <FlatList
        data={assignments}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({item}) => (
          <View style={styles.assignedStudentRow}>
            <Text style={styles.assignmentStudent}>{item}</Text>
            <TouchableOpacity
              style={styles.removeStudentButton}
              onPress={() => onRemoveStudent(item)}>
              <Text style={styles.removeStudentText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        style={styles.assignedStudentsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  assignmentInfo: {
    marginTop: 8,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  assignmentStudent: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginVertical: 4,
  },
  noAssignment: {
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  removeButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  assignedStudentsList: {
    maxHeight: 200,
    marginVertical: 8,
  },
  assignedStudentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  removeStudentButton: {
    padding: 6,
    backgroundColor: '#ff6b6b',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeStudentText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default AssignmentSummary;