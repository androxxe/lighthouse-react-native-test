/* eslint-disable no-unused-vars */
export enum Status {
  Created = "Created",
  InProgress = "InProgress",
  Completed = "Completed",
}

export const StatusColorMapper: Record<Status, string> = {
  Created: "purple-500",
  InProgress: "yellow-500",
  Completed: "green-500",
};
