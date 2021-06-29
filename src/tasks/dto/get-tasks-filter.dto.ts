import { TaskStatus } from '../task.models';

export class GetTasksFilter {
  status: TaskStatus;
  search: string;
}
