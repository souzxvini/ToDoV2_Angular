import { UserService } from './../../services/user.service';
import { Category } from './../../model/category.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateCategoryModalComponent } from './modal/create-category-modal/create-category-modal.component';
import { TaskService } from 'src/app/services/task.service';
import { ConfirmationDialogComponent, ConfirmDialogModel } from '../confirmation-dialog/confirmation-dialog.component';
import { Observable, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  categories: Category[];
  categoryTodoTasksLength: any[];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(["(max-width: 992px)"])
    .pipe(map((result) => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    public router: Router,
    private categoryService: CategoryService,
    private taskService: TaskService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private userService: UserService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {

    //quando alguma tarefa for adicionada, vai chamar essa funcao para atualizar o numero de tarefas para fazer nas categorias
    this.taskService.taskChange$.subscribe(() => {
      this.getCategories();
    });

    this.categoryService.categoryChange$.subscribe(() => {
      this.getCategories();
    });
  }

  signout() {
    this.authService.signout();
    this.router.navigate(['login']);
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        if (data) {
          this.categories = data;
        }
      },
    });
  }

  openModalCreateCategory(keepOpen: boolean) {
    const dialogRef = this.dialog.open(CreateCategoryModalComponent, {
      width: '400px',
      panelClass: 'modalStyle',
      backdropClass: 'modalStyleBackdrop',
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.componentInstance.keepOpen = keepOpen;

    dialogRef.afterClosed().subscribe((data) => {
      if (data.keepOpen) {
        this.getCategories();
        this.openModalCreateCategory(true);
      }
      if (data) {
        this.getCategories();
      }
    });
  }

  openConfirmationDialog() {
    const dialogTitle = this.translateService.instant('HEADER.Confirmacao')
    const dialogMessage = this.translateService.instant('HEADER.DesejaSairDoSistema')
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
        this.signout();
      }
    });
  }

  changeLanguage(language: string) {
    if (language == 'pt' && localStorage.getItem("Language") != 'pt') {
      const dialogTitle = this.translateService.instant('CATEGORY.Confirmacao')
      const dialogMessage = "Do you really wanna change the language to portuguese?"
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
          this.userService.changeLanguage(language).subscribe({
            next: () => {
              localStorage.setItem("Language", language);
              location.reload();
            }
          })
        }
      });
    }
    if (language == 'en' && localStorage.getItem("Language") != 'en') {
      const dialogTitle = this.translateService.instant('CATEGORY.Confirmacao')
      const dialogMessage = "Você realmente deseja alterar o idioma para inglês?"
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
          this.userService.changeLanguage(language).subscribe({
            next: () => {
              localStorage.setItem("Language", language);
              location.reload();
            }
          })
        }
      });
    }
    if (language == 'en' && localStorage.getItem("Language") == 'en') {
      this.snackbar.open(
        "You are already using the english language!",
        this.translateService.instant('SNACKBAR.Fechar'),
        { duration: 6000, panelClass: ['snackbarAlert'] }
      )
    }
    if (language == 'pt' && localStorage.getItem("Language") == 'pt') {
      this.snackbar.open(
        "Você ja está utilizando o idioma português!",
        this.translateService.instant('SNACKBAR.Fechar'),
        { duration: 6000, panelClass: ['snackbarAlert'] }
      )
    }
  }

  changeTheme(theme: string){
    if (theme == 'DARK' && localStorage.getItem("ToDoV2Theme") != 'DARK') {
      const dialogTitle = this.translateService.instant('CATEGORY.Confirmacao')
      const dialogMessage = this.translateService.instant('SNACKBAR.ConfirmarMudancaTemaEscuro')
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
          this.userService.changeTheme(theme).subscribe({
            next: () => {
              localStorage.setItem("ToDoV2Theme", theme);
              location.reload();
            }
          })
        }
      });
    }
    if (theme == 'LIGHT' && localStorage.getItem("ToDoV2Theme") != 'LIGHT') {
      const dialogTitle = this.translateService.instant('CATEGORY.Confirmacao')
      const dialogMessage = this.translateService.instant('SNACKBAR.ConfirmarMudancaTemaClaro')
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
          this.userService.changeTheme(theme).subscribe({
            next: () => {
              localStorage.setItem("ToDoV2Theme", theme);
              location.reload();
            }
          })
        }
      });
    }
    if (theme == 'DARK' && localStorage.getItem("ToDoV2Theme") == 'DARK') {
      this.snackbar.open(
        this.translateService.instant('SNACKBAR.TemaEscuroJaSelecionado'),
        this.translateService.instant('SNACKBAR.Fechar'),
        { duration: 6000, panelClass: ['snackbarAlert'] }
      )
    }
    if (theme == 'LIGHT' && localStorage.getItem("ToDoV2Theme") == 'LIGHT') {
      this.snackbar.open(
        this.translateService.instant('SNACKBAR.TemaClaroJaSelecionado'),
        this.translateService.instant('SNACKBAR.Fechar'),
        { duration: 6000, panelClass: ['snackbarAlert'] }
      )
    }
  }

}
