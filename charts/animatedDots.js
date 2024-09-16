import * as Plot from "@observablehq/plot";

export function createInteractiveScatterPlot(container, initialChaos = 1, {width = 600, height = 400} = {}) {
  const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

  // Generate synthetic data with color-based clustering
  const generateData = (count, chaosLevel) => {
    const clusters = [
      { expCenter: 2, effCenter: 30 },
      { expCenter: 4, effCenter: 60 },
      { expCenter: 7, effCenter: 80 },
      { expCenter: 9, effCenter: 40 }
    ];

    const statusClusters = {
      "Ready": { expOffset: -0.5, effOffset: -5 },
      "On-Call": { expOffset: 0, effOffset: 5 },
      "Deactivated": { expOffset: 0.5, effOffset: -10 }
    };

    return Array.from({length: count}, () => {
      const cluster = clusters[Math.floor(Math.random() * clusters.length)];
      
      let status;
      const rand = Math.random();
      if (rand < 0.05 * chaosLevel) {
        status = "Deactivated";
      } else if (rand < 0.6) {
        status = "Ready";
      } else {
        status = "On-Call";
      }

      const statusCluster = statusClusters[status];
      const experience = Math.max(0, Math.min(10, cluster.expCenter + statusCluster.expOffset + (Math.random() - 0.5)));
      const efficiency = Math.max(0, Math.min(100, cluster.effCenter + statusCluster.effOffset + (Math.random() - 0.5) * 15));

      return {
        experience,
        efficiency,
        status,
        name: `Agent ${Math.floor(Math.random() * 1000)}`,
        state: states[Math.floor(Math.random() * states.length)]
      };
    });
  };

  let data = generateData(200, initialChaos);

  function updateChart() {
    const chart = Plot.plot({
      width,
      height,
      x: {label: "Experience (years)", domain: [0, 10]},
      y: {label: "Efficiency (%)", domain: [0, 100]},
      color: {
        domain: ["Ready", "On-Call", "Deactivated"],
        range: ["#0000ff", "#ffa500", "#ff0000"]  // Blue, Orange, Red
      },
      marks: [
        Plot.dot(data, {
          x: "experience",
          y: "efficiency",
          stroke: "status",
          fill: "status",
          fillOpacity: 0.7,
          r: 3,
          channels: {name: "name", state: "state", status: "status"},
          tip: true
        })
      ]
    });

    container.innerHTML = '';
    container.appendChild(chart);
  }

  updateChart();

  // Function to update chaos level
  function updateChaos(chaosLevel) {
    data = generateData(200 + chaosLevel * 50, chaosLevel);
    updateChart();
  }

  return updateChaos; // Return the function to update chaos level
}