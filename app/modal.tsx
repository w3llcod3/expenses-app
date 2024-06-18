import axios from '@/lib/axios';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface ExpenseModalProps {
  initialData?: ExpenseData;
  visible: boolean;
  onClose: () => void;
}

interface ExpenseData {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const ExpenseModal = ({ initialData, visible, onClose }: ExpenseModalProps) => {
  const [id, setId] = useState(initialData?.id || 0);
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [category, setCategory] = useState(initialData?.category || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || '');

  const handleSubmit = async () => {
    let method = '';
    let payload = {};
    if (id) {
      payload = { id, amount, category, description, date: dayjs(date).toISOString() };
      method = 'PATCH';
    } else {
      payload = { amount, category, description, date: dayjs(date).toISOString() };
      method = 'POST';
    }

    try {
      const res = await axios({
        method,
        url: '/api/expenses',
        data: payload,
      });

      if (res.status === 200 || res.status === 201) {
        Alert.alert('Success', `Expense ${id ? 'updated' : 'added'} successfully`);
        onClose();
      } else {
        throw new Error('Failed to add/update expense');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add/update expense');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{id ? 'Edit Expense' : 'Add Expense'}</Text>
        <Text style={styles.inputTitle}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="100"
          keyboardType="numeric"
          value={amount.toString()}
          onChangeText={(text) => setAmount(parseFloat(text))}
        />
        <Text style={styles.inputTitle}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="Buying groceries, etc."
          value={category}
          onChangeText={setCategory}
        />
        <Text style={styles.inputTitle}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Description of the expense"
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.inputTitle}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{id ? 'Update Expense' : 'Add Expense'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#dc3545',
  },
});

export default ExpenseModal;
