
import * as d3 from "d3";
import * as topojson from "topojson-client";

// List of all US states
const allStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

function generateOutageData(chaosLevel) {
  let outages = [];
  let goodStates = [];

  if (chaosLevel >= 4) {
    // Randomly select 5 states for outages
    const outageStates = d3.shuffle(allStates.slice()).slice(0, 5);
    outages = outageStates.map(state => ({
      state,
      severity: chaosLevel === 5 ? d3.randomUniform(0.8, 1)() : d3.randomUniform(0.6, 0.8)()
    }));

    // Randomly select at least 10 states as good (green)
    goodStates = d3.shuffle(allStates.filter(state => !outageStates.includes(state))).slice(0, 10);
  } else {
    // For levels 1-3, select about 10 states as good (green)
    goodStates = d3.shuffle(allStates.slice()).slice(0, 10 + chaosLevel);
  }

  return { outages, goodStates };
}

export function createHexabin(container, chaosLevel = 1) {
  container.innerHTML = '';
  // Generate data based on chaos level
  const { outages, goodStates } = generateOutageData(chaosLevel);

  // Load the US map data (TopoJSON format)
  d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then((us) => {
    // Create a D3 projection
    const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);

    // Create the terrain map with state borders
    const svg = d3.select(container)
      .append("svg")
      .attr("viewBox", [0, 0, 975, 610])
      .style("width", "100%")
      .style("height", "auto");

    // Define a color scale based on severity (0.0 to 1.0)
    const colorScale = d3.scaleLinear()
      .domain([0, 0.6, 0.8, 1])
      .range(["#2ecc71", "#f1c40f", "#e67e22", "#e74c3c"]);

    // Draw the US map (land areas)
    svg.append("path")
      .datum(topojson.feature(us, us.objects.nation))
      .attr("fill", "#e0e0e0")
      .attr("d", d3.geoPath(projection));

    // Draw the state boundaries
    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "white")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .join("path")
      .attr("d", d3.geoPath(projection))
      .attr("fill", (d) => {
        const stateName = d.properties.name;
        const outage = outages.find((o) => o.state === stateName);
        if (outage) {
          return colorScale(outage.severity);
        } else if (goodStates.includes(stateName)) {
          return "#2ecc71"; // Green for good states
        } else {
          return "#d3d3d3"; // Light gray for neutral states
        }
      });

    // Add labels for power outage data and good states
    svg.append("g")
      .selectAll("text")
      .data([...outages, ...goodStates.map(state => ({ state, severity: 0 }))])
      .join("text")
      .attr("transform", (d) => {
        const stateFeature = topojson.feature(us, us.objects.states).features.find((f) => f.properties.name === d.state);
        if (!stateFeature) return null;
        const [x, y] = projection(d3.geoCentroid(stateFeature));
        return `translate(${x},${y})`;
      })
      .attr("fill", "black")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text((d) => d.severity ? `${d.state}: ${d.severity.toFixed(2)}` : d.state);

    // Add a legend for the color scale
    const legend = svg.append("g").attr("transform", "translate(20, 20)");

    const legendScale = d3.scaleLinear().domain([0, 1]).range([0, 100]);

    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickFormat(d3.format(".1f"));

    legend.selectAll("rect")
      .data(d3.range(0, 1.1, 0.1))
      .join("rect")
      .attr("x", (d) => legendScale(d))
      .attr("y", -10)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d) => colorScale(d));

    legend.append("g")
      .attr("transform", "translate(0, 0)")
      .call(legendAxis)
      .append("text")
      .attr("x", 0)
      .attr("y", 25)
      .text("Severity")
      .attr("fill", "black");

    // Add chaos level indicator
    svg.append("text")
      .attr("x", 20)
      .attr("y", 580)
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text(`Current Emergency State: ${chaosLevel}`);
  });
}

// Function to update the map with a new chaos level
// export function updateChaosLevel(container, newChaosLevel) {
//   d3.select(container).selectAll("*").remove(); // Clear the container
//   createHexabin(container, newChaosLevel); // Recreate the map with the new chaos level
// }