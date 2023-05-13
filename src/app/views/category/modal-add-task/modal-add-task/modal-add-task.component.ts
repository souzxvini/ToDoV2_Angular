import { MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../../../services/task.service';
import { Priority } from '../../../../model/priority.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Category } from 'src/app/model/category.model';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-add-task',
  templateUrl: './modal-add-task.component.html',
  styleUrls: ['./modal-add-task.component.css'],
})
export class ModalAddTaskComponent implements OnInit {

  keepOpen: boolean;
  loading = false;
  category: Category;
  formTask: FormGroup;
  priorities: string[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<ModalAddTaskComponent>,
    private snackbar: MatSnackBar,
    private translateService: TranslateService
    ) {

  }

  ngOnInit(): void {
    this.getPriorities();

    this.formTask = this.fb.group({
      description: [null, Validators.required],
      categoryId: [null, Validators.required],
      initialDate: [null],
      deadline: [null],
      priority: [null, Validators.required],
    });

    this.formTask.valueChanges.subscribe(() => {
      if(!this.formTask.get('initialDate').value || !this.formTask.get('deadline').value){
        this.formTask.get('initialDate').setErrors( null)
        this.formTask.get('deadline').setErrors( null)
        return;
      }
      if(this.formTask.get('initialDate').value.getTime() > this.formTask.get('deadline').value.getTime()){
        this.formTask.get('initialDate').setErrors({invalido: true})
        this.formTask.get('deadline').setErrors({invalido: true})
      }else{
        this.formTask.get('initialDate').setErrors( null)
        this.formTask.get('deadline').setErrors( null)
      }
    })

    this.formTask.get('categoryId').setValue(this.category.categoryId)
  }

  createTask(form){
    this.taskService.createTask(form).subscribe({
      next: () => {
        this.snackbar.open(
          this.translateService.instant('SNACKBAR.TarefaAdicionada'),
          this.translateService.instant('SNACKBAR.Fechar'),
          { duration: 6000, panelClass: ['snackbarSuccess'] }
        );
        this.taskService.onTaskChange();
        if(this.keepOpen){
          this.dialogRef.close({ keepOpen: true });
        } else{
          this.dialogRef.close(true);
        }
      }
    })
  }

  getPriorities() {
    this.priorities = Object.values(Priority);
  }


}
