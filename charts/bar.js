import * as Plot from "@observablehq/plot";

const sampleData = [
  { "category": "General", "value": 18 },
  { "category": "Help Desk", "value": 2 },
  { "category": "Power Outage", "value": 0 },
  { "category": "City Response", "value": 0 }
];

export function createBarChart(data = sampleData, { width = 700, height = 400 } = {}) {
  const colors = ["#00BFFF", "#1E90FF", "#9932CC", "#8A2BE2"];

  function updateChart() {
    return Plot.plot({
      width,
      height,
      marginLeft: 80,  // Increased to accommodate larger y-axis labels
      marginRight: 20,
      marginBottom: 60,  // Increased to accommodate larger x-axis labels
      marginTop: 60,  // Increased to accommodate larger title
      grid: true,
      x: {
        label: "Queue",
        tickRotate: 0,
        labelOffset: 40,  // Increased to move label further from axis
        fontSize: 14  // Increased font size for x-axis label
      },
      y: {
        label: "Number of Agents",
        domain: [0, Math.max(...data.map(d => d.value)) * 1.2],
        labelOffset: 50,  // Increased to move label further from axis
        fontSize: 14  // Increased font size for y-axis label
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
          dy: -10,
          fontSize: 16,  // Increased font size for bar value labels
          fontWeight: "bold"
        }),
        Plot.axisX({
          tickSize: 0,
          fontSize: 16// Increased font size for x-axis tick labels
        }),
        Plot.axisY({
          fontSize: 12  // Increased font size for y-axis tick labels
        })
      ],
      style: {
        backgroundColor: "white",
        color: "black",
        fontFamily: "sans-serif",
        fontSize: 24,  // Base font size for the chart
        ".plot-title": {
          fontSize: "24px",  // Increased font size for the title
          fontWeight: "bold"
        }
      }
    });
  }

  let chart = updateChart();
  return chart;
}