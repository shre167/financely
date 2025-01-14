import React, { useState } from "react";
import { Select, Table, Radio } from "antd";
import searchImg from "../../assets/search.svg";
import { unparse } from "papaparse";
import { parse } from "papaparse";
import { toast } from "react-toastify";
import "./styles.css";

function TransactionsTable({
  transactions,
  addTransaction,
  fetchTransactions,
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { Option } = Select;
  const [sortKey, setSortKey] = useState("");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  let filteredTransactions = transactions
    .map((item, index) => ({
      ...item,
      key: index,
    }))
    .filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (typeFilter === "" || item.type.includes(typeFilter))
    );

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  function exportCSV() {
    const csv = unparse({
      fields: ["name", "type", "tag", "date", "amount"],
      data: transactions,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      //toast.error(e.message);
    }
  }

  return (
    <div className="transactions-table-wrapper">
      <div className="toolbar">
        <div className="input-flex">
          <img src={searchImg} alt="Search" width="16" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
          />
        </div>

        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter by type"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className="actions">
        <h2>My Transactions</h2>

        <Radio.Group
          className="input-radio"
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
        >
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="date">Sort by Date</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>
        </Radio.Group>

        <div className="action-buttons">
          <button className="btn" onClick={exportCSV}>
            Export to CSV
          </button>
          <label htmlFor="file-csv" className="btn btn-blue">
            Import from CSV
          </label>
          <input
            id="file-csv"
            type="file"
            accept=".csv"
            onChange={importFromCsv}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="table-container">
        <Table dataSource={sortedTransactions} columns={columns} />
      </div>
    </div>
  );
}

export default TransactionsTable;
