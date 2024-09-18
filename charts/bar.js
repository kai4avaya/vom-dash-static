import * as Plot from "@observablehq/plot";


const sampleData = [
  { "category": "General", "value": 18 },
      { "category": "Help Desk", "value": 2 },
      { "category": "Power Outage", "value": 0 },
      { "category": "City Response", "value": 0 }
]
export function createBarChart(data = sampleData, { width = 700, height = 400 } = {}) {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"];

  function updateChart() {
    return Plot.plot({
      width,
      height,
      marginLeft: 60,
      marginRight: 20,
      marginBottom: 50,
      marginTop: 40,
      grid: true,
      x: {
        label: "Queue",
        tickRotate: 0
      },
      y: {
        label: "Number of Agents",
        domain: [0, Math.max(...data.map(d => d.value)) * 1.2]
      },
      title: "Staffed Agents per Queue",
      marks: [
        Plot.barY(data, {
          x: "category",
          y: "value",
          fill: (d, i) => colors[i % colors.length],
          title: d => `${d.category}: ${d.value}`
        }),
        Plot.ruleY([0]),
        Plot.text(data, {
          x: "category",
          y: "value",
          text: d => d.value,
          dy: -10
        }),
        Plot.axisX({
          tickSize: 0
        })
      ],
      style: {
        backgroundColor: "white",
        color: "black",
        fontFamily: "sans-serif"
      }
    });
  }

  let chart = updateChart();
  return chart;
}