import React, {useState, useEffect} from "react";
import {View, StyleSheet, Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {TextInput, Button, Text} from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";

export default function AddExpenseScreen({navigation, route}) {
	const expenseToEdit = route.params?.expense || null;

	const [amount, setAmount] = useState("");
	const [note, setNote] = useState("");

	// Category Dropdown
	const [open, setOpen] = useState(false);
	const [category, setCategory] = useState("");
	const categories = [
		{label: "Food", value: "Food"},
		{label: "Travel", value: "Travel"},
		{label: "Shopping", value: "Shopping"},
		{label: "Bills", value: "Bills"},
		{label: "Others", value: "Others"},
	];

	useEffect(() => {
		if (expenseToEdit) {
			setAmount(expenseToEdit.amount);
			setCategory(expenseToEdit.category);
			setNote(expenseToEdit.note);
		}
	}, [expenseToEdit]);

	const handleSaveExpense = async () => {
		if (!amount || !category) {
			Alert.alert("Error", "Amount and Category are required.");
			return;
		}

		try {
			const storedExpenses = await AsyncStorage.getItem("expenses");
			let expenses = storedExpenses ? JSON.parse(storedExpenses) : [];

			if (expenseToEdit) {
				// Update existing expense
				expenses = expenses.map((exp) =>
					exp.id === expenseToEdit.id ? {...exp, amount, category, note} : exp
				);
			} else {
				// Add new expense
				const newExpense = {
					id: Date.now().toString(),
					amount,
					category,
					note,
					date: new Date().toISOString(),
				};
				expenses.push(newExpense);
			}

			await AsyncStorage.setItem("expenses", JSON.stringify(expenses));

			Alert.alert(
				"Success",
				expenseToEdit ? "Expense updated!" : "Expense added!"
			);
			navigation.goBack();
		} catch (error) {
			console.error("Error saving expense:", error);
			Alert.alert("Error", "Failed to save expense.");
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{expenseToEdit ? "Edit Expense" : "Add Expense"}
			</Text>

			<TextInput
				label="Amount"
				value={amount}
				onChangeText={setAmount}
				keyboardType="numeric"
				style={styles.input}
			/>

			<DropDownPicker
				open={open}
				value={category}
				items={categories}
				setOpen={setOpen}
				setValue={setCategory}
				placeholder="Select Category"
				style={styles.dropdown}
			/>

			<TextInput
				label="Note"
				value={note}
				onChangeText={setNote}
				style={styles.input}
			/>

			<Button
				mode="contained"
				onPress={handleSaveExpense}
				style={styles.button}
			>
				{expenseToEdit ? "Update Expense" : "Add Expense"}
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {flex: 1, padding: 20, justifyContent: "center"},
	title: {fontSize: 24, fontWeight: "bold", marginBottom: 20},
	input: {marginBottom: 10},
	dropdown: {marginBottom: 10, zIndex: 1000},
	button: {marginTop: 10},
});
