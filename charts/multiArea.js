import * as Plot from "@observablehq/plot";

const categoryQueues = ["General", "Help Desk", "Power Outage", "City Response"]

export function createAgentWellnessChart(element, chaosLevel) {
  // Clear the container first
  element.innerHTML = '';

  // Generate data
  const data = generateStressData(chaosLevel);

  // Calculate the maximum total stress at any point
  const maxTotalStress = calculateMaxTotalStress(data);

  // Get unique industries
  const industries = categoryQueues // ["Customer Service", "Technical Support", "Sales", "Management"];

  // Define a color mapping function
  const colorMap = {
    "General": "#d53e4f",
    "Help Desk": "#fc8d59",
    "Power Outage": "#fee08b",
    "City Response": "#99d594"
  };

  // Create the plot
  const plot = Plot.plot({
    width: 800,
    height: 400,
    y: { 
      grid: true, 
      label: "Stress Level",
      domain: [0, Math.min(maxTotalStress, 100)],
      ticks: 5
    },
    x: { 
      label: "Time of Day",
      tickFormat: d => d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      ticks: 12
    },
    color: {
      legend: false, // Disable default legend
      domain: industries,
      range: industries.map(i => colorMap[i])
    },
    title: "Agent Stress Level per Queue",
    marks: [
      Plot.areaY(data, {
        x: "date",
        y: "stressLevel",
        fill: "industry",
        stroke: "industry",
        title: d => `${d.industry}: ${d.stressLevel.toFixed(2)}`,
        curve: "basis"
      }),
      Plot.ruleY([0])
    ],
    style: {
      backgroundColor: "white"
    },
    marginRight: 120 // Increase right margin to accommodate custom legend
  });

  // Create a container for the chart and legend
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.alignItems = 'center';

  // Append the plot to the container
  container.appendChild(plot);

  // Create and append custom legend
  const legend = createCustomLegend(industries, colorMap);
  container.appendChild(legend);

  // Append the container to the specified element
  element.appendChild(container);
}

function createCustomLegend(industries, colorMap) {
  const legend = document.createElement('div');
  legend.style.marginLeft = '20px';
  legend.style.display = 'flex';
  legend.style.flexDirection = 'column';

  const title = document.createElement('div');
  title.textContent = 'Industry';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '10px';
  legend.appendChild(title);

  industries.forEach(industry => {
    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.marginBottom = '10px'; // Add margin between legend items

    const colorBox = document.createElement('div');
    colorBox.style.width = '20px';
    colorBox.style.height = '20px';
    colorBox.style.backgroundColor = colorMap[industry];
    colorBox.style.marginRight = '5px';

    const label = document.createElement('span');
    label.textContent = industry;

    item.appendChild(colorBox);
    item.appendChild(label);
    legend.appendChild(item);
  });

  return legend;
}

function generateStressData(chaosLevel) {
  const industries = categoryQueues;
  const data = [];
  const startDate = new Date(2024, 0, 1, 8, 0); // Start at 8:00 AM
  const endDate = new Date(2024, 0, 1, 20, 0);  // End at 8:00 PM

  for (let industry of industries) {
    let stressLevel = 2 + Math.random() * 3; // Lower starting stress level
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Add some randomness and stress increase based on chaos level
      const randomFactor = Math.random() * 2 - 1; // Random value between -1 and 1
      const chaosFactor = calculateChaosFactor(chaosLevel);

      stressLevel += randomFactor + chaosFactor;
      stressLevel = Math.max(0, Math.min(25, stressLevel)); // Keep individual stress between 0 and 25

      data.push({ 
        date: new Date(currentDate),
        industry: industry,
        stressLevel: stressLevel
      });

      // Increment by 30 minutes
      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }
  }

  return data;
}

function calculateChaosFactor(chaosLevel) {
    if (chaosLevel <= 1) {
      return 0; // No increase for chaos level 1
    } else {
      return Math.pow(chaosLevel - 1, 2) * 0.2; // More gradual increase for chaos levels above 1
    }
  }

function calculateMaxTotalStress(data) {
  const timePoints = [...new Set(data.map(d => d.date.getTime()))];
  return Math.max(...timePoints.map(time => 
    data.filter(d => d.date.getTime() === time)
      .reduce((sum, d) => sum + d.stressLevel, 0)
  ));
}