import * as Plot from "@observablehq/plot";

function generateInitialData(chaosLevel) {
  const baseValue = 50;
  const volatility = Math.pow(chaosLevel, 2);
  const now = new Date();
  return Array.from({ length: 60 }, (_, i) => ({
    date: new Date(now.getTime() - (59 - i) * 1000),
    value: baseValue + (Math.random() - 0.5) * volatility
  }));
}

export function createLineGraph(chaosLevel = 1, { width = 500, height = 300 } = {}) {
  let data = [
    { name: "_Queue Length", values: generateInitialData(chaosLevel) }
  ];
  let chartElement;

  function formatTime(date) {
    return date.toTimeString().split(' ')[0];
  }

  function updateChart() {
    const flattenedData = data.flatMap(d => d.values.map(v => ({ ...v, name: d.name })));

    const chart = Plot.plot({
      width,
      height,
      marginLeft: 60,
      marginRight: 40,
      marginBottom: 30,
      grid: true,
      x: {
        type: "time",
        label: "Time",
        tickFormat: formatTime,
        domain: [flattenedData[0].date, flattenedData[flattenedData.length - 1].date]
      },
      y: { 
        label: "Customers in Queue",
        domain: [0, 100]
      },
      color: { legend: true },
      marks: [
        Plot.line(flattenedData, {
          x: "date",
          y: "value",
          stroke: "name",
          strokeWidth: 2,
          curve: "natural"
        }),
        Plot.ruleY([0])
      ]
    });

    return chart;
  }

  function animate() {
    const now = new Date();
    data = data.map(series => ({
      name: series.name,
      values: [
        ...series.values.slice(1),
        {
          date: now,
          value: Math.max(0, Math.min(100, series.values[series.values.length - 1].value + 
            (Math.random() - 0.5) * Math.pow(chaosLevel, 2)))
        }
      ]
    }));

    const newChartElement = updateChart();
    
    if (chartElement) {
      chartElement.replaceWith(newChartElement);
    }
    chartElement = newChartElement;

    requestAnimationFrame(animate);
  }

  chartElement = updateChart();
  requestAnimationFrame(animate);

  return chartElement;
}