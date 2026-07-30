import { CHART_TYPES } from "../consts/chart";

export type ChartType = (typeof CHART_TYPES)[number];

export const CHART_TYPES_WITH_R: ChartType[] = ["Bubble"];
