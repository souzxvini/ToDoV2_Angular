import { MatPaginator } from '@angular/material/paginator';
import { ModalUpdateTaskComponent } from './modal-update-task/modal-update-task.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalAddTaskComponent } from './modal-add-task/modal-add-task/modal-add-task.component';
import { Category } from './../../model/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from '../../model/status.model';
import { Task } from 'src/app/model/task.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'src/app/componentes/confirmation-dialog/confirmation-dialog.component';
import { ConclusionStatus } from 'src/app/model/conclusion-status.model';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {

  taskId: number;
  categoryId: number;
  category: Category;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;
  @ViewChild('paginator4') paginator4: MatPaginator;

  categories: Category[];
  formFilters: any
  todoTasksDataSource = new MatTableDataSource<Task>([]);
  completeTodoTasksDataSource = new MatTableDataSource<Task>([]);
  doneTasksDataSource = new MatTableDataSource<Task>([]);
  completeDoneTasksDataSource = new MatTableDataSource<Task>([]);
  notStartedTasksDataSource = new MatTableDataSource<Task>([]);
  completeNotStartedTasksDataSource = new MatTableDataSource<Task>([]);
  expiredTasksDataSource = new MatTableDataSource<Task>([]);
  completeExpiredTasksDataSource = new MatTableDataSource<Task>([]);
  displayedColumns = ['checkbox', 'description', 'priority', 'initialDate', 'deadline', 'edit', 'delete']
  displayedColumn2 = ['checkbox', 'description', 'priority', 'initialDate', 'deadline', 'delete']

  todoTasksPrioritiesFilter = ['1', '2', '3']
  doneTasksPrioritiesFilter = ['1', '2', '3']
  notStartedTasksPrioritiesFilter = ['1', '2', '3']
  expiredTasksPrioritiesFilter = ['1', '2', '3']

  todoExpandedPanel = false;
  doneExpandedPanel = false;
  notStartedExpandedPanel = false;
  expiredExpandedPanel = false;

  @ViewChild('todoTasksTable') sort1: MatSort;
  @ViewChild('doneTasksTable') sort2: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private taskService: TaskService,
    private snackbar: MatSnackBar,
    private router: Router,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.taskId = params['taskId'];
    });

    this.activatedRoute.params.subscribe(params => {
      this.categoryId = params['id'];

      if (isNaN(this.categoryId)) {
        this.router.navigate(['404'])
        return
      }

      this.categoryService.getCategories().subscribe({
        next: (data) => {
          if (data) {
            this.categories = data;
            if (!this.categories.find(c => c.categoryId == this.categoryId)) {
              this.router.navigate(['404'])
              return
            }
          }
        },
      });

      this.getCategory(this.categoryId);

    });


  }

  getCategory(categoryId) {
    this.categoryService.getCategory(categoryId).subscribe({
      next: (data) => {
        this.category = data
        this.doneExpandedPanel = false;
        this.notStartedExpandedPanel = false;
        this.expiredExpandedPanel = false;

        this.todoTasksDataSource = new MatTableDataSource<Task>(data.todoTasks);
        this.completeTodoTasksDataSource = new MatTableDataSource<Task>(data.todoTasks);
        setTimeout(() => {
          this.todoTasksDataSource.paginator = this.paginator1;
          this.todoTasksDataSource.sort = this.sort1;
        }, 0);
        this.todoTasksPrioritiesFilter = ['1', '2', '3'];
        this.todoTasksDataSource.filterPredicate = (data: any, filter: string) => {
          if (data.description?.toLowerCase().trim().includes(filter)) {
            return true
          } else {
            return false
          }
        }
        this.todoTasksDataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {

          if (typeof data[sortHeaderId] === 'string') {
            return data[sortHeaderId].toLocaleLowerCase();
          }

          return data[sortHeaderId];
        };

        this.doneTasksDataSource = new MatTableDataSource<Task>(data.doneTasks);
        this.completeDoneTasksDataSource = new MatTableDataSource<Task>(data.doneTasks);
        setTimeout(() => {
          this.doneTasksDataSource.paginator = this.paginator2;
          this.doneTasksDataSource.sort = this.sort2;
        }, 0);
        this.doneTasksPrioritiesFilter = ['1', '2', '3']
        this.doneTasksDataSource.filterPredicate = (data: any, filter: string) => {
          if (data.description?.toLowerCase().trim().includes(filter)) {
            return true
          } else {
            return false
          }
        }

        this.notStartedTasksDataSource = new MatTableDataSource<Task>(data.notStartedTasks);
        this.completeNotStartedTasksDataSource = new MatTableDataSource<Task>(data.notStartedTasks);
        setTimeout(() => {
          this.notStartedTasksDataSource.paginator = this.paginator3;
        }, 0);
        this.notStartedTasksPrioritiesFilter = ['1', '2', '3']
        this.notStartedTasksDataSource.filterPredicate = (data: any, filter: string) => {
          if (data.description?.toLowerCase().trim().includes(filter)) {
            return true
          } else {
            return false
          }
        }

        this.expiredTasksDataSource = new MatTableDataSource<Task>(data.expiredTasks);
        this.completeExpiredTasksDataSource = new MatTableDataSource<Task>(data.expiredTasks);
        setTimeout(() => {
          this.expiredTasksDataSource.paginator = this.paginator4;
        }, 0);
        this.expiredTasksPrioritiesFilter = ['1', '2', '3']
        this.expiredTasksDataSource.filterPredicate = (data: any, filter: string) => {
          if (data.description?.toLowerCase().trim().includes(filter)) {
            return true
          } else {
            return false
          }
        }

        this.redirectToTask();
        this.adicionarOuvinteDeCliqueNaTela();

      }
    })
  }

  redirectToTask(){
    setTimeout(() => {
      const taskIndex = this.todoTasksDataSource.data.findIndex(task => task.id == this.taskId);

      if (taskIndex !== -1) {
        const pageIndex = Math.floor(taskIndex / this.paginator1.pageSize);
        this.paginator1.pageIndex = pageIndex;
        setTimeout(() => {
          this.todoTasksDataSource.paginator = this.paginator1;
        }, 0);
        this.todoExpandedPanel = true;
      }

    }, 0);

    setTimeout(() => {
      const taskIndex = this.doneTasksDataSource.data.findIndex(task => task.id == this.taskId);

      if (taskIndex !== -1) {
        const pageIndex = Math.floor(taskIndex / this.paginator2.pageSize);
        this.paginator2.pageIndex = pageIndex;
        setTimeout(() => {
          this.doneTasksDataSource.paginator = this.paginator2;
        }, 0);
        this.doneExpandedPanel = true;
      }
    }, 0);

    setTimeout(() => {
      const taskIndex = this.notStartedTasksDataSource.data.findIndex(task => task.id == this.taskId);

      if (taskIndex !== -1) {
        const pageIndex = Math.floor(taskIndex / this.paginator3.pageSize);
        this.paginator3.pageIndex = pageIndex;
        setTimeout(() => {
          this.notStartedTasksDataSource.paginator = this.paginator3;
        }, 0);
        this.notStartedExpandedPanel = true;
      }
    }, 0);

    setTimeout(() => {
      const taskIndex = this.expiredTasksDataSource.data.findIndex(task => task.id == this.taskId);

      if (taskIndex !== -1) {
        const pageIndex = Math.floor(taskIndex / this.paginator3.pageSize);
        this.paginator3.pageIndex = pageIndex;
        setTimeout(() => {
          this.expiredTasksDataSource.paginator = this.paginator3;
        }, 0);
        this.expiredExpandedPanel = true;
      }
    }, 0);
  }

  adicionarOuvinteDeCliqueNaTela() {
    document.addEventListener('click', this.onClick.bind(this));
  }

  onClick() {
    const currentRoute = this.router.url;
    if (currentRoute.includes('/category') && this.taskId ) {
      this.taskId = null;
    }
  }

  deleteTask(id) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.snackbar.open(
          this.translateService.instant('SNACKBAR.TarefaExcluida'),
          this.translateService.instant('SNACKBAR.Fechar'),
          { duration: 6000, panelClass: ['snackbarSuccess'] }
        );
        this.getCategory(this.categoryId);
        this.taskService.onTaskChange();
      }
    })
  }

  deleteCategory(id) {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.snackbar.open(
          this.translateService.instant('SNACKBAR.CategoriaExcluida'),
          this.translateService.instant('SNACKBAR.Fechar'),
          { duration: 6000, panelClass: ['snackbarSuccess'] }
        );
        this.getCategory(this.categoryId);
        this.categoryService.onCategoryChange();
        this.getCategories(true)
      }
    })
  }

  getCategories(categoryDeleted?) {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        if (data) {
          this.categories = data;
          if (categoryDeleted && this.categories.length == 0) {
            this.router.navigate([''])
          } else if (categoryDeleted) {
            this.router.navigate(['category', `${this.categories[0].categoryId}`])
          }
        }
      },
    });
  }

  verifyIfTaskIsDone(task: Task) {
    if (task.status === Status.DONE) {
      return true;
    }
    return false;
  }

  changeTaskStatus(task: Task) {
    this.taskService.changeTaskStatus(task.id).subscribe({
      next: () => {
        this.getCategory(this.category.categoryId);
        this.taskService.onTaskChange();
        if (task.status == Status.TO_DO) {
          this.snackbar.open(
            this.translateService.instant('SNACKBAR.TarefaConcluida'),
            this.translateService.instant('SNACKBAR.Fechar'),
            { duration: 6000, panelClass: ['snackbarSuccess'] }
          );
        }

      }
    })
  }

  openModalAddTask(keepOpen: boolean) {
    const dialogRef = this.dialog.open(ModalAddTaskComponent, {
      width: '500px',
      panelClass: 'modalStyle',
      backdropClass: 'modalStyleBackdrop',
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.componentInstance.keepOpen = keepOpen;
    dialogRef.componentInstance.category = this.category;

    dialogRef.afterClosed().subscribe((data) => {
      if (data?.keepOpen) {
        this.getCategory(this.categoryId);
        this.openModalAddTask(true);
      }
      if (data) {
        this.getCategory(this.categoryId);
      }
    });
  }

  openDeleteTaskConfirmationDialog(id) {
    const dialogTitle = this.translateService.instant('CATEGORY.Confirmacao')
    const dialogMessage = this.translateService.instant('CATEGORY.DesejaExcluirTarefa')
    const dialogData = new ConfirmDialogModel(dialogTitle, dialogMessage, true, true, 'end');

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: dialogData,
      panelClass: 'modalStyle',
      backdropClass: 'modalStyleBackdrop',
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.deleteTask(id);
      }
    });
  }

  openUpdateTaskDialog(taskId) {
    const dialogRef = this.dialog.open(ModalUpdateTaskComponent, {
      width: '500px',
      panelClass: 'modalStyle',
      backdropClass: 'modalStyleBackdrop',
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.componentInstance.taskId = taskId;

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.getCategory(this.categoryId);
      }
    });
  }

  openDeleteCategoryConfirmationDialog(id) {
    const dialogTitle = this.translateService.instant('CATEGORY.Confirmacao')
    const dialogMessage = this.translateService.instant('CATEGORY.DesejaExcluirCategoria')
    const dialogData = new ConfirmDialogModel(dialogTitle, dialogMessage, true, true, 'end');

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: dialogData,
      panelClass: 'modalStyle',
      backdropClass: 'modalStyleBackdrop',
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.deleteCategory(id);
      }
    });
  }

  filterTasks(datasource, event) {
    const filterValue = event.target.value.trim().toLowerCase();
    this[datasource].filter = filterValue;
  }

  filterTasksByPriority(dataSource, completeDataSource, filter, paginator){
    this[dataSource].data = this[completeDataSource].data;

    if (this[filter].length == 1) {
      this[dataSource].data = this[dataSource].data.filter(item => item.priority == this[filter][0]);
    }

    if (this[filter].length == 2) {
      this[dataSource].data = this[dataSource].data.filter(item => (item.priority == this[filter][0] || item.priority == this[filter][1]));
    }

    setTimeout(() => {
      this[dataSource].paginator = this[paginator];
    }, 0);
  }

}
