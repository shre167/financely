import React from "react";
import { Line, Pie } from "@ant-design/charts";

function ChartComponent({ sortedTransactions }) {
  // Mapping the sorted transactions to data for Line chart
  const data = sortedTransactions.map((item) => ({
    date: item.date,
    amount: item.amount,
  }));

  // Filtering and mapping transactions of type "expense" for Pie chart
  const pieData = sortedTransactions
    .filter((transaction) => transaction.type === "expense")
    .map((transaction) => ({
      type: transaction.tag,
      value: transaction.amount,
    }));

  // Reducing pieData to aggregate the amounts for each tag
  let finalSpendings = pieData.reduce((acc, obj) => {
    let key = obj.type;
    if (!acc[key]) {
      acc[key] = { tag: obj.type, amount: obj.value }; // create a new object for the tag
    } else {
      acc[key].amount += obj.value;
    }
    return acc;
  }, {});

  // Creating a new array for final spendings with default values
  let newSpendings = [
    { tag: "food", amount: 0 },
    { tag: "education", amount: 0 },
    { tag: "recreation", amount: 0 },
  ];

  // Mapping the finalSpendings to the newSpendings array
  Object.values(finalSpendings).forEach((item) => {
    if (item.tag === "food") {
      newSpendings[0].amount += item.amount;
    } else if (item.tag === "education") {
      newSpendings[1].amount += item.amount;
    } else if (item.tag === "recreation") {
      newSpendings[2].amount += item.amount;
    }
  });

  // Line chart configuration
  const lineConfig = {
    data,
    width: 500,
    autoFit: true,
    xField: "date",
    yField: "amount",
  };

  // Pie chart configuration
  const pieConfig = {
    data: newSpendings,
    angleField: "amount",
    colorField: "tag",
    radius: 0.8, // Controls the size of the pie chart
    innerRadius: 0, // Set innerRadius to 0 to make it a full circle
  };

  // Handle chart instance readiness (optional)
  const handleChartReady = (chartInstance) => {
    console.log("Chart instance:", chartInstance);
    // Perform actions with the chart instance if needed
  };

  return (
    <div className="wrapper">
      <div className="charts-wrapper">
        <h1>Your Analytics</h1>
        <Line {...lineConfig} onReady={handleChartReady} />
      </div>
      <div className="charts-wrapper">
        <h1>Your Expenses</h1>
        <Pie {...pieConfig} />
      </div>
    </div>
  );
}

export default ChartComponent;
