import { Category } from './category.model';
import { ConclusionStatus } from './conclusion-status.model';
import { Priority } from './priority.model';
import { Status } from './status.model';

export class Task{
  id: number;
  description: string;
  status: Status
  conclusionStatus: ConclusionStatus
  category: Category
  initialDate: Date
  deadline: Date
  priority: Priority
  categoryId: number
  categoryName: string
}
