import { ChartType } from "../types/charts";

export const CHART_TYPES = [
  "Line",
  "Bar",
  "Radar",
  "Doughnut",
  "Polar Area",
  "Bubble",
  "Pie",
  "Scatter",
] as const;

export const CHART_COLORS = [
  { border: "rgb(3, 74, 216)", background: "rgba(3, 74, 216, 0.5)" },
  { border: "rgb(255, 99, 132)", background: "rgba(255, 99, 132, 0.5)" },
  { border: "rgb(54, 162, 235)", background: "rgba(54, 162, 235, 0.5)" },
  { border: "rgb(255, 206, 86)", background: "rgba(255, 206, 86, 0.5)" },
  { border: "rgb(153, 102, 255)", background: "rgba(153, 102, 255, 0.5)" },
  { border: "rgb(255, 159, 64)", background: "rgba(255, 159, 64, 0.5)" },
  { border: "rgb(0, 204, 150)", background: "rgba(0, 204, 150, 0.5)" },
  { border: "rgb(201, 203, 207)", background: "rgba(201, 203, 207, 0.5)" },
] as const;

export const CHART_TYPES_WITH_R: ChartType[] = ["Bubble"];

export const CHART_TYPES_SINGLE_DATASET: ChartType[] = [
  "Doughnut",
  "Pie",
  "Polar Area",
];
