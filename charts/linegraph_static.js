import * as Plot from "@observablehq/plot";

export function createHandleTimeGraph(element, chaos_number) {
  // Clear the container first
  element.innerHTML = '';  // Corrected from innerHtml to innerHTML

  // Generate data
  const data = generateData(chaos_number);

  // Find the point with the biggest jump
  const biggestJump = findBiggestJump(data);

  // Create the plot
  const plot = Plot.plot({
    width: 800,
    height: 400,
    y: { 
      grid: true, 
      label: "Handle Time (minutes)",
      domain: [0, 60],
      ticks: 6
    },
    x: { 
      label: "Time of Day",
      tickFormat: d => {
        const hour = Math.floor(d / 2) + 8;
        const minute = (d % 2) * 30;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      },
      ticks: 12
    },
    title: "Avg Handle Time per Queue",
    marks: [
      Plot.lineY(data, {x: "x", y: "y", stroke: "blue"}),
      Plot.ruleX([biggestJump.x], {stroke: "orange"}),
      Plot.ruleX(data, Plot.pointerX({x: "x", py: "y", stroke: "red"})),
      Plot.dot(data, Plot.pointerX({x: "x", y: "y", stroke: "red"})),
      Plot.text(data, Plot.pointerX({
        px: "x", 
        py: "y", 
        dy: -17, 
        frameAnchor: "top-left", 
        fontVariant: "tabular-nums", 
        text: (d) => [
          `Time: ${formatTime(d.x)}`,
          `Handle Time: ${d.y.toFixed(2)} min`
        ].join("   ")
      }))
    ]
  });

  // Append the plot to the specified element
  element.appendChild(plot);
}

function generateData(chaos_number) {
  const data = [];
  const numPoints = 24; // 8am to 8pm in 30-minute increments
  let y = 20; // Starting handle time

  for (let i = 0; i < numPoints; i++) {
    // Add some randomness and occasional jumps based on chaos_number
    const randomFactor = Math.random() * 5 - 2.5; // Random value between -2.5 and 2.5
    const jumpFactor = Math.random() < 0.1 ? (chaos_number * 5) : 0; // Occasional jump based on chaos_number

    y += randomFactor + jumpFactor;
    y = Math.max(0, Math.min(60, y)); // Keep y between 0 and 60

    data.push({ x: i, y: y });
  }

  return data;
}

function findBiggestJump(data) {
  let biggestJump = { x: 0, jump: 0 };
  for (let i = 1; i < data.length; i++) {
    const jump = Math.abs(data[i].y - data[i-1].y);
    if (jump > biggestJump.jump) {
      biggestJump = { x: data[i].x, jump: jump };
    }
  }
  return biggestJump;
}

function formatTime(x) {
  const hour = Math.floor(x / 2) + 8;
  const minute = (x % 2) * 30;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}