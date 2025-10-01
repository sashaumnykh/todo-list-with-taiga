import { Guid } from "../shared/types/guid";

export interface Task {
  id: Guid;
  title: string;
  checked: boolean;
}