import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Priority } from 'src/app/model/priority.model';
import { TaskService } from 'src/app/services/task.service';
import { ModalAddTaskComponent } from '../modal-add-task/modal-add-task/modal-add-task.component';
import { Task } from 'src/app/model/task.model';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-update-task',
  templateUrl: './modal-update-task.component.html',
  styleUrls: ['./modal-update-task.component.css']
})
export class ModalUpdateTaskComponent implements OnInit {

  formUpdateTask: FormGroup;
  taskId: number
  task: Task;
  loaded: boolean = true

  priorities = [
    {
      icon: 'keyboard_arrow_up',
      viewValue: 'Alta',
      class: 'high-priority',
      value: 1
    }, {
      icon: 'keyboard_arrow_right',
      viewValue: 'Média',
      class: 'medium-priority',
      value: 2
    }, {
      icon: 'keyboard_arrow_down',
      viewValue: 'Baixa',
      class: 'low-priority',
      value: 3
    },
  ];

  selected: any;

  constructor(
    private fb: UntypedFormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<ModalAddTaskComponent>,
    private snackbar: MatSnackBar,
    private datePipe: DatePipe,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.formUpdateTask = this.fb.group({
      description: [null, Validators.required],
      initialDate: [null],
      deadline: [null],
      priority: [null, Validators.required],
    });

    this.taskService.getTask(this.taskId).subscribe({
      next: (data) => {
        this.task = data
        this.fillForm(this.task);
      }
    })

    this.formUpdateTask.valueChanges.subscribe(() => {
      if (!this.formUpdateTask.get('initialDate').value || !this.formUpdateTask.get('deadline').value) {
        this.formUpdateTask.get('initialDate').setErrors(null)
        this.formUpdateTask.get('deadline').setErrors(null)
        return;
      }
      if (this.formUpdateTask.get('initialDate').value.getTime() > this.formUpdateTask.get('deadline').value.getTime()) {
        this.formUpdateTask.get('initialDate').setErrors({ invalido: true })
        this.formUpdateTask.get('deadline').setErrors({ invalido: true })
      } else {
        this.formUpdateTask.get('initialDate').setErrors(null)
        this.formUpdateTask.get('deadline').setErrors(null)
      }
    })
  }

  fillForm(task: Task) {
    this.formUpdateTask.get('description').setValue(task.description);

    if (task.initialDate) {
      let initialDate = new Date(task.initialDate);
      initialDate.setDate(initialDate.getDate() + 1)
      this.formUpdateTask.get('initialDate').setValue(initialDate);
    }
    if (task.deadline) {
      let deadline = new Date(task.deadline);
      deadline.setDate(deadline.getDate() + 1)
      this.formUpdateTask.get('deadline').setValue(deadline);
    }

    if (task.priority == '1') {
      this.selected = this.priorities[0]
      
    } else if(task.priority == '2'){
      this.selected = this.priorities[1]
    } else{
      this.selected = this.priorities[2]
    }

    this.setPriority();
  }

  updateTask() {
    this.loaded = false;

    const body = JSON.stringify({
      taskId: this.task.id,
      description: this.formUpdateTask.get('description').value,
      initialDate: this.datePipe.transform(this.formUpdateTask.get('initialDate').value, 'dd-MM-yyyy'),
      deadline: this.datePipe.transform(this.formUpdateTask.get('deadline').value, 'dd-MM-yyyy'),
      priority: this.formUpdateTask.get('priority').value
    });
    this.taskService.updateTask(body).subscribe({
      next: () => {
        this.loaded = true;
        this.snackbar.open(
          this.translateService.instant('SNACKBAR.TarefaAtualizada'),
          this.translateService.instant('SNACKBAR.Fechar'),
          { duration: 6000, panelClass: ['snackbarSuccess'] }
        );
        this.dialogRef.close(true);
      },
      error: () => {
        this.loaded = true;
      }
    })
  }

  setPriority() {
    this.formUpdateTask.controls['priority'].setValue(this.selected.value);
  }
}
