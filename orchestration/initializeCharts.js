import { createBarChart } from "../charts/bar.js";
import { manualUpdate } from "../charts/counters.js";
import { typeWriter } from "../charts/animatedText.js";
import { createAnimatedPieChart } from "../charts/pieCircle.js";
import {createHandleTimeGraph} from "../charts/linegraph_static.js"
import {createAgentWellnessChart} from "../charts/multiArea.js"


export function initializeCharts(data = null) {
  console.log("i am data", data)

  manualUpdate(data?.counters || 1);
  typeWriter(data?.antimatedText);
 

  // Create and append bar chart
  const barChart = createBarChart(data?.bar);
  const barPanel = document.querySelector("#bar-chart-panel");
  const stackAreaPanel = document.querySelector("#multi-area-panel");
  const emergencyFlow = document.querySelector("#emergency_workflow2")
  const normalFlow = document.querySelector("#emergency_workflow_non")

  createAgentWellnessChart(stackAreaPanel, data?.multiArea || 1)

  barPanel.innerHTML = "";
  barPanel.appendChild(barChart);

  const lineGraphStaticPanel = document.querySelector("#line-graph-static-panel");  
  const __ = createHandleTimeGraph(lineGraphStaticPanel, data?.lineGraphStatic || 1)

  const pieChartContReal = document.getElementById("pie-panel");
  const _ = createAnimatedPieChart(
    pieChartContReal,
    data?.pieChart || 1
  );

  if(data?.workflow === '1')
  {
    emergencyFlow.style.display = 'block';
    normalFlow.style.display = 'none';
  }
  else{
    emergencyFlow.style.display = 'none';
    normalFlow.style.display = 'block';
  }
}
