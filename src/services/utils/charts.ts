import { CHART_COLORS } from "../consts/chart";

export function getChartColor(index: number) {
  return CHART_COLORS[index % CHART_COLORS.length];
}
