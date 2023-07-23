import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-create-category-modal',
  templateUrl: './create-category-modal.component.html',
  styleUrls: ['./create-category-modal.component.css']
})
export class CreateCategoryModalComponent implements OnInit {

  keepOpen: boolean
  loading = false

  constructor(
    private fb: UntypedFormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<CreateCategoryModalComponent>,
    private snackbar: MatSnackBar,
    private translateService: TranslateService

  ) { }

  formCategory = this.fb.group({
    name: [null, [Validators.required]]
  });

  ngOnInit(): void {
  }

  createCategory(){
    this.loading = true;
    this.categoryService.createCategory(this.formCategory.get('name').value).subscribe({
      next: () => {
        this.loading = false;
        this.snackbar.open(
          this.translateService.instant('SNACKBAR.CategoriaAdicionada'),
          this.translateService.instant('SNACKBAR.Fechar'),
          { duration: 6000, panelClass: ['snackbarSuccess'] }
        );

        this.categoryService.onCategoryChange();

        if(this.keepOpen){
          this.dialogRef.close({ keepOpen: true });
        } else{
          this.dialogRef.close(true);
        }
      }
    })
  }

}
