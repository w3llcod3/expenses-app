import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from '@/lib/axios';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';

interface Expense {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
}

const ExpensesScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/expenses');
      setExpenses(response.data.successResult.items);
    } catch (err) {
      setError('Failed to fetch expenses.');
    }
    setLoading(false);
  };

  const deleteExpense = async (id: number) => {
    try {
      await axios.delete(`/api/expenses?id=${id}`);
      fetchExpenses();
    } catch (err) {
      setError('Failed to delete expense.');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View style={styles.expenseItem}>
      <Text style={styles.expenseText}>{dayjs(item.date).format('MMM D, YYYY')}</Text>
      <Text style={styles.expenseText}>{item.category}</Text>
      <Text style={styles.expenseText}>{item.description}</Text>
      <Text style={styles.expenseText}>{item.amount.toFixed(2)} AED</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => {
            /* navigation.navigate('EditExpense', { expense: item }); */
          }}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => {
            Alert.alert(
              'Delete Expense',
              'Are you sure you want to delete this expense?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => deleteExpense(item.id) },
              ],
              { cancelable: true }
            );
          }}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  expenseItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  expenseText: {
    fontSize: 16,
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default ExpensesScreen;
