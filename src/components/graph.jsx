import React from "react";
import { Chart } from "react-charts";

const Graph = ({ balance }) => (
  // A react-chart hyper-responsively and continuusly fills the available
  // space of its parent element automatically
  <div
    style={{
      width: "100%",
      height: "438px"
    }}
  >
    <Chart
      data={[
        {
          label: "Transaction Amount",
          data: balance
        }
      ]}
      axes={[
        { primary: true, type: "linear", position: "bottom" },
        { type: "linear", position: "left" }
      ]}
    />
  </div>
);

export default Graph;
