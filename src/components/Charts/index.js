import React from "react";
import { Line, Pie } from "@ant-design/charts";
import "./styles.css";

function ChartComponent({ sortedTransactions }) {
  const data = sortedTransactions.map((item) => ({
    date: item.date,
    amount: item.amount,
  }));

  const pieData = sortedTransactions
    .filter((transaction) => transaction.type === "expense")
    .map((transaction) => ({
      type: transaction.tag,
      value: transaction.amount,
    }));

  const finalSpendings = pieData.reduce((acc, obj) => {
    const key = obj.type;
    if (!acc[key]) {
      acc[key] = { tag: obj.type, amount: obj.value };
    } else {
      acc[key].amount += obj.value;
    }
    return acc;
  }, {});

  const newSpendings = [
    { tag: "food", amount: 0 },
    { tag: "education", amount: 0 },
    { tag: "recreation", amount: 0 },
  ];

  Object.values(finalSpendings).forEach((item) => {
    const index = newSpendings.findIndex((s) => s.tag === item.tag);
    if (index > -1) {
      newSpendings[index].amount += item.amount;
    }
  });

  const lineConfig = {
    data,
    autoFit: true,
    xField: "date",
    yField: "amount",
  };

  const pieConfig = {
    data: newSpendings,
    angleField: "amount",
    colorField: "tag",
    radius: 0.8,
    innerRadius: 0,
  };

  return (
    <div className="chart-component-wrapper">
      <h1 className="header">Your Analytics</h1>
      <div className="charts-container">
        <div className="chart-item">
          <h2>Line Chart</h2>
          <Line {...lineConfig} />
        </div>
        <div className="chart-item">
          <h2>Pie Chart</h2>
          <Pie {...pieConfig} />
        </div>
      </div>
    </div>
  );
}

export default ChartComponent;
