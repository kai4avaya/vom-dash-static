import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

const cars = [
  {
    name: "East CC1",
    Agents: 105,
    ActiveCalls: 21,
    TotalRevenue: 4296,
    AvailableStations: 16,
    AverageAgentReturn: 2130
  },
  {
    name: "West CC2",
    Agents: 350,
    ActiveCalls: 21,
    TotalRevenue: 15906,
    AvailableStations: 13,
    AverageAgentReturn: 4290
  },
  {
    name: "North CC3",
    Agents: 90,
    ActiveCalls: 41,
    TotalRevenue: 5397,
    AvailableStations: 15,
    AverageAgentReturn: 2040
  },
  {
    name: "South CC4",
    Agents: 258,
    ActiveCalls: 17,
    TotalRevenue: 4749,
    AvailableStations: 11,
    AverageAgentReturn: 3350
  },
  {
    name: "Central CC5",
    key: "Agents",
    raw: 304,
    fx: 3,
    fy: 10,
    value: 88.76
  },
  {
    name: "Central CC5",
    key: "ActiveCalls",
    raw: 26,
    fx: 3,
    fy: 30,
    value: 99.6341463414634146
  },
  {
    name: "Central CC5",
    key: "TotalRevenue",
    raw: 4453,
    fx: 3,
    fy: 78,
    value: 0.27995724883691686
  }
];

const pointMaker = () => {
  const points = d3.sort(cars, d => d.Price).flatMap(({ name, ...values }, i) =>
    Object.entries(values).map(([key, raw]) => ({
      name,
      key,
      raw,
      fx: (1 + i) % 4, // trellis (facets); we leave facet <0,0> empty for the legend
      fy: Math.floor((1 + i) / 4)
    }))
  );
  for (const [, g] of d3.group(points, d => d.key)) {
    const m = d3.max(g, d => d.raw);
    for (const d of g) d.value = d.raw / m;
  }
  return points;
};

const points = pointMaker();
const longitude = d3.scalePoint(new Set(Plot.valueof(points, "key")), [180, -180]).padding(0.5).align(1);

export function createCallCenterRadarChart(container, initialChaos = 1, { width = 800, height = 600 } = {}) {
  const chart = Plot.plot({
    width: Math.max(width, 600),
    marginBottom: 10,
    projection: {
      type: "azimuthal-equidistant",
      rotate: [0, -90],
      domain: d3.geoCircle().center([0, 90]).radius(1.22)(),
    },
    facet: {
      data: points,
      x: "fx",
      y: "fy",
      axis: null,
    },
    marks: [
      Plot.text(points, Plot.selectFirst({ text: "name", frameAnchor: "bottom", fontWeight: "400", fontSize: 14 })),
      Plot.geo([1.0, 0.8, 0.6, 0.4, 0.2], {
        geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
        stroke: "black",
        fill: "black",
        strokeOpacity: 0.2,
        fillOpacity: 0.02,
        strokeWidth: 0.5,
      }),
      Plot.link(longitude.domain(), {
        x1: longitude,
        y1: 90 - 0.8,
        x2: 0,
        y2: 90,
        stroke: "white",
        strokeOpacity: 0.5,
        strokeWidth: 2.5,
      }),
      Plot.text([0.4, 0.6, 0.8], {
        fx: 0,
        fy: 0,
        x: 180,
        y: (d) => 90 - d,
        dx: 2,
        textAnchor: "start",
        text: (d) => (d == 0.8 ? `${100 * d}th percentile` : `${100 * d}th`),
        fill: "currentColor",
        stroke: "white",
        fontSize: 12,
      }),
      Plot.text(longitude.domain(), {
        fx: 0,
        fy: 0,
        x: longitude,
        y: 90 - 1.07,
        text: Plot.identity,
        lineWidth: 5,
        fontSize: 12,
      }),
      Plot.text(longitude.domain(), {
        fx: 0,
        fy: 0,
        facet: "exclude",
        x: longitude,
        y: 90 - 1.09,
        text: (d) => d[0],
        lineWidth: 5,
      }),
      Plot.area(points, {
        x1: ({ key }) => longitude(key),
        y1: ({ value }) => 90 - value,
        x2: 0,
        y2: 90,
        fill: "#4269D0",
        fillOpacity: 0.25,
        stroke: "#4269D0",
        curve: "cardinal-closed",
      }),
      Plot.dot(points, {
        x: ({ key }) => longitude(key),
        y: ({ value }) => 90 - value,
        fill: "#4269D0",
        stroke: "white",
      }),
      Plot.text(
        points,
        Plot.pointer({
          x: ({ key }) => longitude(key),
          y: ({ value }) => 90 - value,
          text: (d) => `${d.raw}\n(${Math.round(100 * d.value)}%)`,
          textAnchor: "start",
          dx: 4,
          fill: "currentColor",
          stroke: "white",
          maxRadius: 10,
          fontSize: 12,
        })
      ),
    ],
  });

  container.innerHTML = '';
  container.appendChild(chart);

  return chart;
}
