import * as Plot from "@observablehq/plot";

const chaosLevel = 1;  // You can change this value to increase/decrease fluctuation
const colorScheme = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949"];

// Generate synthetic data for multiple sensors
export function generateSensorData(numSensors = 3, hours = 50) {
  const data = [];
  for (let sensor = 0; sensor < numSensors; sensor++) {
    for (let hour = 0; hour <= hours; hour++) {
      data.push({
        hour: hour,
        value: Math.random() * 10,  // Random initial values
        sensor: `Call Center ${sensor + 1}`
      });
    }
  }
  return data;
}

// Fluctuate the data slightly based on the chaos level
function fluctuateData(data, chaos) {
  return data.map(d => ({
    ...d,
    value: Math.max(0, d.value + (Math.random() - 0.5) * chaos)  // Random fluctuation
  }));
}

// Function to create and update the line chart
export function createSensorLineGraph(container, initialData = null, chaos = chaosLevel, { width = 700, height = 300 } = {}) {
  let data = initialData && Array.isArray(initialData) ? [...initialData] : generateSensorData();

  // function updateChart() {
  //   const chart = Plot.plot({
  //     width,
  //     height,
  //     marginLeft: 60,
  //     marginBottom: 30,
  //     grid: true,
  //     x: { label: "Hour" },
  //     y: { label: "Sensor Value", domain: [0, 20] },
  //     color: { legend: true },
  //     marks: [
  //       Plot.lineY(data, { x: "hour", y: "value", stroke: "sensor", strokeWidth: 2 }),
  //       Plot.ruleY([0])  // Baseline
  //     ]
  //   });

  
  function updateChart() {
    const chart = Plot.plot({
      width,
      height,
      marginLeft: 60,
      marginRight: 120,
      marginBottom: 50,
      marginTop: 40,
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        background: "#f7f7f7"
      },
      x: {
        label: "Hour →",
        tickFormat: d => d.toString().padStart(4, '0'),
        labelOffset: 30
      },
      y: {
        label: "↑ Sensor Value",
        domain: [0, 20],
        grid: true,
        ticks: 5
      },
      color: {
        scheme: "category10",
      },
      marks: [
        Plot.ruleY([0]),
        Plot.lineY(data, {
          x: "hour",
          y: "value",
          stroke: "sensor",
          strokeWidth: 2,
          opacity: 0.8,
          curve: "basis"
        }),
        Plot.text(data, Plot.selectLast({
          x: "hour",
          y: "value",
          z: "sensor",
          text: "sensor",
          dx: 5,
          dy: -5,
          fill: "sensor"
        }))
      ],
      title: "Real-time Call Center Sensor Data"
    });

    container.innerHTML = '';
    container.appendChild(chart);
  }


  function animate() {
    data = fluctuateData(data, chaos);
    data = data.map(d => ({ ...d, hour: d.hour + 1 }));  // Shift to the right

    updateChart();

    requestAnimationFrame(animate);  // Continue the animation
  }

  // Initial chart creation
  updateChart();

  // Start animation
  requestAnimationFrame(animate);

  // Return a function to update the data if needed
  return (newData) => {
    if (newData && Array.isArray(newData)) {
      data = newData;
      updateChart();
    } else {
      console.error("Invalid data provided to update the sensor graph");
    }
  };
}