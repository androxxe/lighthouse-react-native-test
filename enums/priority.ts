/* eslint-disable no-unused-vars */
export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export const PriorityColorMapper: Record<Priority, string> = {
  Low: "green-500",
  Medium: "yellow-500",
  High: "red-500",
};
