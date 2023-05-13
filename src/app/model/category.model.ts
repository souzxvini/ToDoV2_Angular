import { User } from 'src/app/model/user.model';
import { Task } from './task.model';

export class Category{
  id: number;
  categoryId: number;
  name: string;
  doneTasks: Task[] = new Array<Task>();
  todoTasks: Task[] = new Array<Task>();
  notStartedTasks: Task[] = new Array<Task>();
  expiredTasks: Task[] = new Array<Task>();
  user: User
}
