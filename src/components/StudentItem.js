import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

/**
 * Reusable component for displaying a student item with a remove option
 * @param {Object} props - Component props
 * @param {string} props.name - Student name to display
 * @param {Function} props.onRemove - Function to call when remove button is pressed
 * @param {boolean} props.isSelected - Whether this student is currently selected
 * @param {Function} props.onPress - Function to call when student item is pressed
 */
const StudentItem = ({
  name,
  onRemove,
  isSelected = false,
  onPress = null,
}) => {
  return (
    <View style={[styles.studentItem, isSelected && styles.selectedItem]}>
      <Text style={[styles.studentName, isSelected && styles.selectedText]}>
        {name}
      </Text>
      {onRemove && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onRemove}>
          <Text style={styles.deleteButtonText}>Remove</Text>
        </TouchableOpacity>
      )}
      {onPress && !onRemove && (
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={onPress}>
          <Text style={styles.selectButtonText}>Select</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  studentItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  studentName: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  selectedText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  selectButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4, 
  },
  selectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default StudentItem;