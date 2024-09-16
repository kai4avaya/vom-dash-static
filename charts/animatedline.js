import * as Plot from "@observablehq/plot";

export function createAnimatedLineGraph(container, chaosLevel = 1) {
  const numPoints = 60;
  const now = new Date();
  let data = Array(numPoints).fill().map((_, i) => ({
    date: new Date(now.getTime() - (numPoints - 1 - i) * 1000),
    value: 2 + Math.random() * 2 // Start with values between 2 and 4
  }));

  function formatTime(date) {
    return date.toTimeString().split(' ')[0];
  }

  function updateData() {
    const now = new Date();
    const baseValue = 2; // Minimum value
    const maxAmplitude = 3; // Maximum amplitude for oscillations
    const randomFactor = Math.random() * 2 - 1; // Random factor between -1 and 1
    const newValue = baseValue +
      (Math.sin(now.getTime() / 1500) * maxAmplitude * chaosLevel / 5) +
      (Math.cos(now.getTime() / 3000) * maxAmplitude * chaosLevel / 10) +
      (randomFactor * maxAmplitude * chaosLevel / 5);
    data = [
      ...data.slice(1),
      {
        date: now,
        value: Math.max(baseValue, Math.min(10, newValue)) // Ensure value is at least baseValue
      }
    ];
  }

  function renderChart() {
    const chart = Plot.plot({
      title: "Wait-time per Engagement",
      width: container.clientWidth,
      height: 400,
      y: {
        domain: [0, 10], // Keep y-axis consistent for easy comparison
        label: "Wait-time (minutes)",
        grid: true
      },
      x: {
        type: "time",
        label: "Time",
        tickFormat: formatTime,
        domain: [data[0].date, data[data.length - 1].date]
      },
      marks: [
        Plot.line(data, {
          x: "date",
          y: "value",
          curve: "natural",
          stroke: "black",
          strokeWidth: 2
        }),
      ]
    });

    container.innerHTML = '';
    container.appendChild(chart);
  }

  function animate() {
    updateData();
    renderChart();
    requestAnimationFrame(animate);
  }

  // Initial render
  renderChart();

  // Start animation
  animate();

  // Function to update chaos level
  return function updateChaosLevel(newLevel) {
    chaosLevel = newLevel;
  };
}