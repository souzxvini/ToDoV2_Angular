import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('buttonColor', [
      state('normal', style({
      })),
      state('logged', style({
        backgroundColor: 'green'
      })),
      transition('normal <=> changed', [
        animate('1s')
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private translateService: TranslateService
  ) { }

  hidePassword = true;
  isLoading = false;
  logged = false;

  buttonState = 'normal';

  form = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]]
  })

  ngOnInit(): void {
  }

  login(){
    this.isLoading = true
    let user = new User();

    user.email = this.form.get("email").value
    user.password = this.form.get("password").value

    this.authService.authenticate(user).subscribe({
      next: () => {
        this.isLoading = false
        this.buttonState = 'logged';
        this.logged = true
        setTimeout(() => {
          this.router.navigate(['home']);
        }, 700);
      },
      error: () => {
        this.isLoading = false;
        this.snackbar.open(
          this.translateService.instant('SNACKBAR.DadosInvalidos'),
          this.translateService.instant('SNACKBAR.Fechar'),
          { duration: 6000, panelClass: ['snackbarErro'] }
        );
      }

    })
  }




}
