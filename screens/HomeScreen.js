import React, {useState, useEffect} from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	Alert,
	ScrollView,
} from "react-native";
import {Button, Card, IconButton} from "react-native-paper";
import {db} from "../firebaseConfig"; // Import Firestore instance
import {collection, onSnapshot, deleteDoc, doc} from "firebase/firestore";

export default function HomeScreen({navigation}) {
	const [expenses, setExpenses] = useState([]);
	const [filter, setFilter] = useState(""); // Store selected category filter

	useEffect(() => {
		// Fetch expenses from Firestore in real-time
		const expensesRef = collection(db, "expenses");
		const unsubscribe = onSnapshot(expensesRef, (snapshot) => {
			const expensesData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setExpenses(expensesData);
		});

		return unsubscribe; // Unsubscribe on unmount
	}, []);

	const handleDeleteExpense = async (id) => {
		Alert.alert(
			"Confirm Delete",
			"Are you sure you want to delete this expense?",
			[
				{text: "Cancel", style: "cancel"},
				{
					text: "Delete",
					onPress: async () => {
						try {
							await deleteDoc(doc(db, "expenses", id));
							Alert.alert("Success", "Expense deleted!");
						} catch (error) {
							console.error("Error deleting expense:", error);
							Alert.alert("Error", "Failed to delete expense.");
						}
					},
				},
			]
		);
	};

	// Filter expenses based on selected category
	const filteredExpenses = filter
		? expenses.filter((exp) => exp.category === filter)
		: expenses;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Your Expenses</Text>

			{/* Scrollable Filter Buttons */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.filterScroll}
			>
				{["Food", "Travel", "Shopping", "Bills", "All"].map((category) => (
					<Button
						key={category}
						mode={
							filter === category || (category === "All" && filter === "")
								? "contained"
								: "outlined"
						}
						onPress={() => setFilter(category === "All" ? "" : category)}
						labelStyle={styles.buttonText}
						style={styles.filterButton}
					>
						{category}
					</Button>
				))}
			</ScrollView>

			{filteredExpenses.length === 0 ? (
				<Text style={styles.noExpenses}>No expenses found.</Text>
			) : (
				<FlatList
					data={filteredExpenses}
					keyExtractor={(item) => item.id}
					renderItem={({item}) => (
						<Card style={styles.card}>
							<Card.Content>
								<Text style={styles.amount}>
									💰 {item.amount} - {item.category}
								</Text>
								<Text>{item.note}</Text>
								<Text style={styles.date}>
									{new Date(item.date).toDateString()}
								</Text>
							</Card.Content>
							<Card.Actions>
								<IconButton
									icon="pencil"
									color="blue"
									onPress={() =>
										navigation.navigate("AddExpense", {expense: item})
									}
								/>
								<IconButton
									icon="delete"
									color="red"
									onPress={() => handleDeleteExpense(item.id)}
								/>
							</Card.Actions>
						</Card>
					)}
				/>
			)}

			<Button
				mode="contained"
				onPress={() => navigation.navigate("AddExpense")}
				style={styles.button}
			>
				Add Expense
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
	},
	filterScroll: {
		marginBottom: 10,
		paddingVertical: 5,
	},
	filterButton: {
		marginRight: 10,
		height: 40,
		minWidth: 90,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 12,
	},
	buttonText: {
		fontSize: 14,
		textAlign: "center",
	},
	expenseListContainer: {
		flex: 1,
		marginTop: 10,
	},
	noExpenses: {
		textAlign: "center",
		marginTop: 20,
		fontSize: 16,
	},
	card: {
		marginBottom: 10,
		padding: 10,
	},
	amount: {
		fontSize: 16,
		fontWeight: "bold",
	},
	date: {
		fontSize: 12,
		color: "gray",
	},
	button: {
		marginTop: 10,
	},
});
