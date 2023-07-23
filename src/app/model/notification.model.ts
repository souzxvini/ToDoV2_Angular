import { Category } from './category.model';
import { ConclusionStatus } from './conclusion-status.model';
import { Status } from './status.model';

export class Notification {
  id: number;
  title: string;
  description: string;
  date: Date;
  visualized: boolean;
  clicked: boolean;
  tasks = new Array<NotificationTasksModel>();
  expanded: boolean;
}

export class NotificationTasksModel {
  id: number;
  description: string;
  initialDate: Date;
  deadline: Date;
  priority: string;
  status: Status;
  conclusionStatus: ConclusionStatus;
  categoryId: number;
  categoryName: string;
}
