import React, { useState, useEffect } from "react";
import Header from "../components/Header/Index";
import Cards from "../components/Cards";
import AddIncomeModal from "../components/Modals/addIncome";
import AddExpenseModal from "../components/Modals/addExpense";
import { addDoc, collection, query, getDocs, Transaction } from "firebase/firestore";
import { auth, db } from "../firebase";
import moment from "moment";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionsTable from "../components/TransactionsTable";
import ChartComponent from "../components/Charts";
import NoTransactions from "../components/NoTransactions";
import { Line, Pie } from "@ant-design/charts";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0); // Fixed: Added setExpense
  const [totalBalance, setTotalBalance] = useState(0);
 

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added!");

      // Add the new transaction to the existing state
      setTransactions((prevTransactions) => [...prevTransactions, transaction]);

      // Update balance
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal); // Use setExpense instead of setExpenses
    setTotalBalance(incomeTotal - expensesTotal); // Use setTotalBalance
  };

  async function fetchTransactions() {
    setLoading(true);
    try {
      if (user) {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        let transactionsArray = [];
        querySnapshot.forEach((doc) => {
          console.log("Document data: ", doc.data()); // Log the fetched data
          transactionsArray.push(doc.data());
        });

        console.log("Transactions Array: ", transactionsArray); // Log the full array after fetch
        setTransactions(transactionsArray);
        toast.success("Transactions Fetched!");
      } else {
        console.log("User is not authenticated!");
      }
    } catch (e) {
      console.error("Error fetching transactions: ", e);
      toast.error("Couldn't fetch transactions");
    } finally {
      setLoading(false);
    }
  }

  let sortedTransactions = transactions.sort((a, b) => {
 
      return new Date(a.date) - new Date(b.date);
    });

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          {transactions.length != 0 ? (
            <ChartComponent sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionsTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
