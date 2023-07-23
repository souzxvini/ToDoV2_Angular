import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/model/task.model';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modal-notification-tasks',
  templateUrl: './modal-notification-tasks.component.html',
  styleUrls: ['./modal-notification-tasks.component.css']
})
export class ModalNotificationTasksComponent implements OnInit {
  @ViewChild('tasksTable') sort1: MatSort;

  formUpdateTask: FormGroup;
  loaded: boolean = true
  selected: any;
  tasks: [] = []
  displayedColumns = ['categoryName','description', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private dialogRef: MatDialogRef<ModalNotificationTasksComponent>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.tasks);

    setTimeout(() => {
      this.dataSource.sort = this.sort1;
    }, 0)
  }

  redirectToTask(row){
    this.dialogRef.close();
    this.router.navigate(['category', `${row.categoryId}` ,`${row.id}`]);
  }

  
}
