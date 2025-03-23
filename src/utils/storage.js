import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STUDENTS_STORAGE_KEY = '@students';
export const ASSIGNMENTS_STORAGE_KEY = '@gita_class_assignments';

/**
 * Format a date string in a user-friendly way
 * @param {string} dateString - Date string in ISO format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';

  console.log(dateString)
  
  const date = new Date(dateString);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };
  console.log(date.toDateString())
  return date.toDateString();
};

/**
 * Load students from AsyncStorage
 * @returns {Promise<Array>} List of students
 */
export const loadStudents = async () => {
  try {
    const storedStudents = await AsyncStorage.getItem(STUDENTS_STORAGE_KEY);
    return storedStudents !== null ? JSON.parse(storedStudents) : [];
  } catch (error) {
    console.error('Failed to load students:', error);
    throw error;
  }
};

/**
 * Save students to AsyncStorage
 * @param {Array} students - List of students to save
 * @returns {Promise<void>}
 */
export const saveStudents = async (students) => {
  try {
    await AsyncStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    console.error('Failed to save students:', error);
    throw error;
  }
};

/**
 * Load assignments from AsyncStorage
 * @returns {Promise<Object>} Assignments object
 */
export const loadAssignments = async () => {
  try {
    const storedAssignments = await AsyncStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    return storedAssignments !== null ? JSON.parse(storedAssignments) : {};
  } catch (error) {
    console.error('Failed to load assignments:', error);
    throw error;
  }
};

/**
 * Save assignments to AsyncStorage
 * @param {Object} assignments - Assignments object to save
 * @returns {Promise<void>}
 */
export const saveAssignments = async (assignments) => {
  try {
    await AsyncStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
  } catch (error) {
    console.error('Failed to save assignments:', error);
    throw error;
  }
};