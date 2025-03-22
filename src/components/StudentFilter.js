import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';

/**
 * Horizontal filter component for selecting students
 * @param {Object} props - Component props
 * @param {Array} props.students - List of students to display
 * @param {string} props.selectedStudent - Currently selected student
 * @param {Function} props.onSelectStudent - Function to call when a student is selected
 * @param {Function} props.onClearFilter - Function to call to clear the filter
 */
const StudentFilter = ({
  students,
  selectedStudent,
  onSelectStudent,
  onClearFilter,
}) => {
  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterLabel}>Filter by Student:</Text>
      <ScrollView 
        horizontal={true} 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedStudent && styles.filterChipActive
          ]}
          onPress={onClearFilter}>
          <Text style={[
            styles.filterChipText,
            !selectedStudent && styles.filterChipTextActive
          ]}>All</Text>
        </TouchableOpacity>
        
        {students.map((student, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterChip,
              selectedStudent === student && styles.filterChipActive
            ]}
            onPress={() => onSelectStudent(student)}>
            <Text style={[
              styles.filterChipText,
              selectedStudent === student && styles.filterChipTextActive
            ]}>{student}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  filterButtonsContainer: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  filterChip: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 4,
  },
  filterChipActive: {
    backgroundColor: '#4CAF50',
  },
  filterChipText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  filterChipTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StudentFilter;