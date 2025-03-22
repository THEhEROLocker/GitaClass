import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

/**
 * Reusable modal component with standard styling
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {string} props.title - Modal title
 * @param {string} props.subtitle - Optional modal subtitle
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.closeButtonText - Text for the close button (default: "Close")
 */
const AppModal = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  closeButtonText = 'Close',
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          
          {subtitle && (
            <Text style={styles.modalSubtitle}>{subtitle}</Text>
          )}
          
          {children}
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}>
            <Text style={styles.closeButtonText}>{closeButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
});

export default AppModal;