import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Calendar} from 'react-native-calendars';
import {
  loadStudents,
  loadAssignments,
  saveAssignments,
  formatDate,
  STUDENTS_STORAGE_KEY,
  ASSIGNMENTS_STORAGE_KEY
} from '../utils/storage';
import StudentFilter from '../components/StudentFilter';
import AssignmentSummary from '../components/AssignmentSummary';

/**
 * Calendar screen component for managing student assignments
 */
const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [assignments, setAssignments] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');

  // Load students and assignments
  useEffect(() => {
    fetchStudents();
    fetchAssignments();
  }, []);

  // Update marked dates whenever assignments, selected date, or student filter changes
  useEffect(() => {
    updateMarkedDates();
  }, [assignments, selectedDate, selectedStudent, updateMarkedDates]);

  // Fetch students from storage
  const fetchStudents = async () => {
    try {
      const studentsList = await loadStudents();
      setStudents(studentsList);
    } catch (error) {
      Alert.alert('Error', 'Failed to load students');
    }
  };

  // Fetch assignments from storage
  const fetchAssignments = async () => {
    try {
      const assignmentsData = await loadAssignments();
      setAssignments(assignmentsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load assignments');
    }
  };

  // Update the marked dates for the calendar based on assignments, selected date, and student filter
  const updateMarkedDates = useCallback(() => {
    const marked = {};
    
    // If a student filter is active, only mark dates where that student is assigned
    if (selectedStudent) {
      Object.entries(assignments).forEach(([date, students]) => {
        // Handle both array and string formats
        const studentList = Array.isArray(students) ? students : [students];
        
        if (studentList.includes(selectedStudent)) {
          marked[date] = {
            startingDay: true,
            endingDay: true,
            color: '#FF9800', // Orange for filtered student
            textColor: 'white',
          };
        }
      });
    } else {
      // No filter active, mark all dates with assignments
      Object.keys(assignments).forEach(date => {
        marked[date] = {
          startingDay: true,
          endingDay: true,
          color: '#4CAF50', // Green for all assignments
          textColor: 'white',
        };
      });
    }
    
    // Highlight selected date with a different color
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#4CAF50',
      };
    }
    
    setMarkedDates(marked);
  }, [assignments, selectedDate, selectedStudent]);

  // Handle date selection on the calendar
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // Assign a student to the selected date
  const assignStudent = (studentName) => {
    const currentAssignments = assignments[selectedDate] || [];
    
    // Check if student is already assigned to this date
    if (Array.isArray(currentAssignments) && currentAssignments.includes(studentName)) {
      Alert.alert('Info', `${studentName} is already assigned to this date`);
      return;
    }
    
    const newAssignments = {
      ...assignments,
      [selectedDate]: Array.isArray(currentAssignments) 
        ? [...currentAssignments, studentName] 
        : [studentName], // Handle legacy data format
    };
    
    setAssignments(newAssignments);
    saveAssignments(newAssignments)
      .then(() => {
        setModalVisible(false);
        Alert.alert('Success', `${studentName} assigned to ${selectedDate}`);
      })
      .catch(() => Alert.alert('Error', 'Failed to save assignment'));
  };

  // Remove all assignments for the selected date
  const removeAllAssignments = () => {
    const newAssignments = {...assignments};
    delete newAssignments[selectedDate];
    
    setAssignments(newAssignments);
    saveAssignments(newAssignments)
      .then(() => Alert.alert('Success', `All assignments removed from ${selectedDate}`))
      .catch(() => Alert.alert('Error', 'Failed to remove assignments'));
  };
  
  // Remove a specific student from the selected date
  const removeStudentAssignment = (studentName) => {
    const currentAssignments = assignments[selectedDate] || [];
    
    if (!Array.isArray(currentAssignments)) {
      // Handle legacy data format
      const newAssignments = {...assignments};
      delete newAssignments[selectedDate];
      setAssignments(newAssignments);
      saveAssignments(newAssignments)
        .catch(() => Alert.alert('Error', 'Failed to remove assignment'));
      return;
    }
    
    const updatedStudents = currentAssignments.filter(name => name !== studentName);
    let newAssignments;
    
    if (updatedStudents.length === 0) {
      // If no students left, remove the date entry
      newAssignments = {...assignments};
      delete newAssignments[selectedDate];
    } else {
      // Update with remaining students
      newAssignments = {
        ...assignments,
        [selectedDate]: updatedStudents
      };
    }
    
    setAssignments(newAssignments);
    saveAssignments(newAssignments)
      .then(() => Alert.alert('Success', `${studentName} removed from ${selectedDate}`))
      .catch(() => Alert.alert('Error', 'Failed to remove student from assignment'));
  };

  // Clear the student filter
  const clearFilter = () => {
    setSelectedStudent('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Calendar</Text>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedStudent ? styles.filterButtonActive : null
          ]}
          onPress={() => setFilterModalVisible(true)}>
          <Text style={styles.filterButtonText}>
            {selectedStudent ? `Filter: ${selectedStudent}` : 'Filter'}
          </Text>
        </TouchableOpacity>
      </View>

      <Calendar
        style={styles.calendar}
        onDayPress={onDayPress}
        markedDates={markedDates}
        markingType={'period'}
        monthFormat={'MMMM yyyy'}
        showWeekNumbers={true}
        firstDay={0}
        enableSwipeMonths={true}
        renderHeader={(date) => {
          const headerDate = date.toString('MMMM yyyy');
          return (
            <Text style={styles.calendarHeader}>{headerDate}</Text>
          );
        }}
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#333',
          textSectionTitleDisabledColor: '#d9e1e8',
          selectedDayBackgroundColor: '#4CAF50',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#4CAF50',
          dayTextColor: '#333',
          textDisabledColor: '#d9e1e8',
          dotColor: '#4CAF50',
          selectedDotColor: '#ffffff',
          arrowColor: '#4CAF50',
          monthTextColor: '#333',
          indicatorColor: '#4CAF50',
          textDayFontSize: 16,
          textDayFontWeight: '500',
          textSectionTitleFontSize: 14,
          textSectionTitleFontWeight: 'bold',
          textMonthFontSize: 18,
          textMonthFontWeight: 'bold',
        }}
      />

      {selectedDate ? (
        <View style={styles.selectedDateContainer}>
          <View style={styles.selectedDateHeader}>
            <View style={styles.dateInfo}>
              <Text style={styles.selectedDateText}>
                {formatDate(selectedDate)}
              </Text>
              <Text style={styles.dateSubtext}>
                {selectedDate}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={removeAllAssignments}>
              <Text style={styles.actionButtonText}>Remove All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.assignButton]}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.actionButtonText}>Assign Students</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.summaryContainer}>
            <FlatList
              data={assignments[selectedDate] || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <AssignmentSummary
                  assignments={[item]}
                  onRemoveStudent={removeStudentAssignment}
                />
              )}
              ListEmptyComponent={
                <Text style={styles.noStudents}>
                  No assignments for this date.
                </Text>
              }
            />
          </View>
        </View>
      ) : null}

      {/* Assignment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Assign Student for {formatDate(selectedDate)}
            </Text>
            <Text style={styles.modalSubtitle}>
              {selectedDate}
            </Text>
            
            {students.length > 0 ? (
              <FlatList
                data={students}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.studentItem}
                    onPress={() => assignStudent(item)}>
                    <Text style={styles.studentName}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noStudents}>
                No students available. Please add students first.
              </Text>
            )}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Filter Calendar by Student
            </Text>
            <Text style={styles.modalSubtitle}>
              Select a student to highlight their assigned days
            </Text>
            
            {students.length > 0 ? (
              <>
                <FlatList
                  data={students}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        styles.studentItem,
                        selectedStudent === item && styles.selectedStudentItem
                      ]}
                      onPress={() => {
                        setSelectedStudent(item);
                        setFilterModalVisible(false);
                      }}>
                      <Text style={[
                        styles.studentName,
                        selectedStudent === item && styles.selectedStudentName
                      ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                {selectedStudent && (
                  <TouchableOpacity
                    style={styles.clearFilterButton}
                    onPress={() => {
                      clearFilter();
                      setFilterModalVisible(false);
                    }}>
                    <Text style={styles.clearFilterText}>Clear Filter</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text style={styles.noStudents}>
                No students available. Please add students first.
              </Text>
            )}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#FF9800',
  },
  filterButtonText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
  },
  calendarHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    padding: 10,
    textAlign: 'center',
  },
  selectedDateContainer: {
    flex: 1,
    marginTop: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateInfo: {
    flex: 1,
    marginRight: 10,
  },
  selectedDateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dateSubtext: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 5,
  },
  assignButton: {
    backgroundColor: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  summaryContainer: {
    flex: 1,
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  studentItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  studentName: {
    fontSize: 16,
    color: '#333',
  },
  noStudents: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  selectedStudentItem: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  selectedStudentName: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  clearFilterButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#ff9800',
    borderRadius: 6,
    alignItems: 'center',
  },
  clearFilterText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CalendarScreen;