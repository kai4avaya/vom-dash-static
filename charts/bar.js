import * as Plot from "@observablehq/plot";


const sampleData = [
  { "category": "Americas", "value": 21 },
  { "category": "APAC", "value": 19 },
  { "category": "EMEA", "value": 16 },
  { "category": "Gitex", "value": 6 }
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