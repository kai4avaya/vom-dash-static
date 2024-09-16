import { createBarChart } from "../charts/bar.js";
import { manualUpdate } from "../charts/counters.js";
import { typeWriter } from "../charts/animatedText.js";
import { createAnimatedPieChart } from "../charts/pieCircle.js";
import {createHandleTimeGraph} from "../charts/linegraph_static.js"
import {createAgentWellnessChart} from "../charts/multiArea.js"
// import { orchestrateScrolling, stopScrolling } from "./scroller";
import { configs } from "../configs/configs";


export function initializeCharts(data = null) {
  // currentData = data  // create global context
  // if (data && isScroll) {
  //   scrollHelper(data, configs.scrollInterval);
  // }
  manualUpdate(data?.counters || 1);
  typeWriter(data?.antimatedText);
 

  // Create and append bar chart
  const barChart = createBarChart(data?.bar);
  const barPanel = document.querySelector("#bar-chart-panel");
  const stackAreaPanel = document.querySelector("#multi-area-panel");
  createAgentWellnessChart(stackAreaPanel, data?.multiArea || 1)

  barPanel.innerHTML = "";
  barPanel.appendChild(barChart);

  const lineGraphStaticPanel = document.querySelector("#line-graph-static-panel");  
  const lineGraphStatic = createHandleTimeGraph(lineGraphStaticPanel, data?.lineGraphStatic || 1)

  const pieChartContReal = document.getElementById("pie-panel");
  const pieChartCont = createAnimatedPieChart(
    pieChartContReal,
    data?.pieChart || 1
  );
}
