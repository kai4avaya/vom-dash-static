
import * as d3 from "d3";

const callCenterMetrics = [
  { category: "Resolved", color: "#2ecc71" },
  { category: "In Progress", color: "#f1c40f" },
  { category: "Waiting", color: "#e67e22" },
  { category: "Escalated", color: "#e74c3c" },
  { category: "Abandoned", color: "#95a5a6" }
];

function generateScenarioData(chaosLevel) {
  switch(chaosLevel) {
    case 1: // Normal operations
      return [
        { category: "Resolved", value: 60 },
        { category: "In Progress", value: 25 },
        { category: "Waiting", value: 10 },
        { category: "Escalated", value: 4 },
        { category: "Abandoned", value: 1 }
      ];
    case 2: // Mild disruption
      return [
        { category: "Resolved", value: 50 },
        { category: "In Progress", value: 30 },
        { category: "Waiting", value: 15 },
        { category: "Escalated", value: 4 },
        { category: "Abandoned", value: 1 }
      ];
    case 3: // Moderate disruption
      return [
        { category: "Resolved", value: 40 },
        { category: "In Progress", value: 30 },
        { category: "Waiting", value: 20 },
        { category: "Escalated", value: 7 },
        { category: "Abandoned", value: 3 }
      ];
    case 4: // Severe disruption
      return [
        { category: "Resolved", value: 30 },
        { category: "In Progress", value: 25 },
        { category: "Waiting", value: 30 },
        { category: "Escalated", value: 10 },
        { category: "Abandoned", value: 5 }
      ];
    case 5: // Critical disruption
      return [
        { category: "Resolved", value: 20 },
        { category: "In Progress", value: 20 },
        { category: "Waiting", value: 35 },
        { category: "Escalated", value: 15 },
        { category: "Abandoned", value: 10 }
      ];
    default:
      return generateScenarioData(1);
  }
}

export function createAnimatedPieChart(container, initialChaosLevel = 1, {width = 500, height = 500} = {}) {
  let chaosLevel = initialChaosLevel;
  let data = generateScenarioData(chaosLevel);

  function createPieChart(t) {
    const radius = Math.min(width, height) / 2 * 0.8 * t;
    
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius);

    const labelArc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.7);

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const g = svg.append("g");

    // Move title to the right
    svg.append("text")
      .attr("x", 20)  // Adjust this value to move left/right
      .attr("y", -height / 2 + 40)  // Adjust this value to move up/down
      .attr("text-anchor", "end")
      .style("font-size", "32px")
      .style("line-height", "48px")
      .style("font-family", "Arial, sans-serif")
      .style("fill", "#333")
      .text("Call Center Metrics");

    const arcs = g.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("fill", d => callCenterMetrics.find(m => m.category === d.data.category).color)
      .attr("d", arc)
      .append("title")
      .text(d => `${d.data.category}: ${d.data.value}`);

    arcs.append("text")
      .attr("transform", d => `translate(${labelArc.centroid(d)})`)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "white")
      .text(d => d.data.value);

    // Move legend to bottom right
    const legend = svg.append("g")
      .attr("transform", `translate(${width/2 - 100}, ${height/2 - 120})`);  // Adjust these values to fine-tune position

    callCenterMetrics.forEach((metric, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);
      
      legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", metric.color);

      legendRow.append("text")
        .attr("x", 15)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .text(metric.category);
    });


    return svg.node();
  }

  function updateChart() {
    const duration = 1000;
    const interpolate = d3.interpolate(0, 1);

    const animate = (time) => {
      const t = Math.min(1, interpolate(time / duration));
      container.innerHTML = '';
      container.appendChild(createPieChart(t));
      if (t < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  function updateChaosLevel(newLevel) {
    chaosLevel = newLevel;
    data = generateScenarioData(chaosLevel);
    updateChart();
  }

  // Initial chart creation
  updateChart();

  return updateChaosLevel;
}
