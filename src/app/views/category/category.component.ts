import { MatPaginator } from '@angular/material/paginator';
import { ModalUpdateTaskComponent } from './modal-update-task/modal-update-task.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalAddTaskComponent } from './modal-add-task/modal-add-task/modal-add-task.component';
import { Category } from './../../model/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { Component, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from '../../model/status.model';
import { Task } from 'src/app/model/task.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'src/app/componentes/confirmation-dialog/confirmation-dialog.component';
import { ConclusionStatus } from 'src/app/model/conclusion-status.model';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {

  categoryId: number;
  category: Category;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  categories: Category[];
  formFilters: any
  todoTasksDataSource = new MatTableDataSource<Task>([]);
  doneTasksDataSource = new MatTableDataSource<Task>([]);
  notStartedTasksDataSource = new MatTableDataSource<Task>([]);
  expiredTasksDataSource = new MatTableDataSource<Task>([]);
  displayedColumns = ['checkbox', 'description', 'priority', 'initialDate', 'deadline', 'edit', 'delete']
  displayedColumn2 = ['checkbox', 'description', 'priority', 'initialDate', 'deadline', 'delete']

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private taskService: TaskService,
    private snackbar: MatSnackBar,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.categoryId = params['id'];

      if(isNaN(this.categoryId) ){
        this.router.navigate(['404'])
        return
      }

      this.categoryService.getCategories().subscribe({
        next: (data) => {
          if (data) {
            this.categories = data;
            if(!this.categories.find(c => c.categoryId == this.categoryId)){
              this.router.navigate(['404'])
              return
            }
          }
        },
      });

      this.getCategory(this.categoryId);
    });
  }

  getCategory(categoryId){
    this.categoryService.getCategory(categoryId).subscribe({
      next: (data) => {
        this.category = data
        this.todoTasksDataSource = new MatTableDataSource<Task>(data.todoTasks);
        this.doneTasksDataSource = new MatTableDataSource<Task>(data.doneTasks);
        this.notStartedTasksDataSource = new MatTableDataSource<Task>(data.notStartedTasks);
        this.expiredTasksDataSource = new MatTableDataSource<Task>(data.expiredTasks);
        this.todoTasksDataSource.paginator = this.paginator;
        this.doneTasksDataSource.paginator = this.paginator;
        this.notStartedTasksDataSource.paginator = this.paginator;
        this.expiredTasksDataSource.paginator = this.paginator;
      }
    })
  }

  deleteTask(id){
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

  deleteCategory(id){
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
          if(categoryDeleted && this.categories.length == 0){
            this.router.navigate([''])
          } else if(categoryDeleted){
            this.router.navigate(['category', `${this.categories[0].categoryId}`])
          }
        }
      },
    });
  }

  verifyIfTaskIsDone(task: Task){
    if(task.status === Status.DONE){
      return true;
    }
    return false;
  }

  changeTaskStatus(task: Task){
    this.taskService.changeTaskStatus(task.id).subscribe({
      next: () => {
        this.getCategory(this.category.categoryId);
        this.taskService.onTaskChange();
        if(task.status == Status.TO_DO){
            this.snackbar.open(
            this.translateService.instant('SNACKBAR.TarefaConcluida'),
            this.translateService.instant('SNACKBAR.Fechar'),
            { duration: 6000, panelClass: ['snackbarSuccess'] }
          );
        }

      }
    })
  }

  checkPriority(priority: string){
    if(priority == 'HIGH'){
      return 'red';
    }
    if(priority == 'MEDIUM'){
      return 'yellow';
    }

    return 'green';
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
      if (data.keepOpen) {
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

  openUpdateTaskDialog(taskId){
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

  conclusionStatusMessage(conclusionStatus: ConclusionStatus){
    if(conclusionStatus === ConclusionStatus.WITHIN_TIME){
      return "Done Within Time";
    }
    if(conclusionStatus === ConclusionStatus.OUT_OF_TIME){
      return "Done Out Of Time";
    }
    if(conclusionStatus === ConclusionStatus.BEFORE_START_TIME){
      return "Done Before Start Time";
    }
    return false;
  }

  conclusionStatusIcon(conclusionStatus: ConclusionStatus){
    if(conclusionStatus === ConclusionStatus.WITHIN_TIME){
      return "assignment_turned_in";
    }
    if(conclusionStatus === ConclusionStatus.OUT_OF_TIME){
      return "report_off";
    }
    if(conclusionStatus === ConclusionStatus.BEFORE_START_TIME){
      return "report";
    }
    return false;
  }

  conclusionStatusIconColor(conclusionStatus: ConclusionStatus){
    if(conclusionStatus === ConclusionStatus.WITHIN_TIME){
      return "green";
    }
    if(conclusionStatus === ConclusionStatus.OUT_OF_TIME){
      return "red";
    }
    if(conclusionStatus === ConclusionStatus.BEFORE_START_TIME){
      return "yellow";
    }
    return "";
  }

}
