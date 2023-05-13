import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { UserExistsValidationService } from 'src/app/services/validations/user-exists-validation.service';
import { SpecialCharacterValidationService } from 'src/app/services/validations/special-character-validation.service';
import { NumberCharacterValidationService } from 'src/app/services/validations/number-character-validation.service';
import { UppercaseCharacterValidationService } from 'src/app/services/validations/uppercase-character-validation.service';
import { LowercaseCharacterValidationService } from 'src/app/services/validations/lowercase-character-validation.service';
import { Min6CharactersValidationService } from 'src/app/services/validations/min-6-characters-validation.service';
import { confirmPasswordEqualsValidator } from 'src/app/services/validations/confirm-password-equals.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackbar: MatSnackBar,
    private userExistsValidationService: UserExistsValidationService,
    private specialCharacterValidationService: SpecialCharacterValidationService,
    private numberCharacterValidationService: NumberCharacterValidationService,
    private uppercaseCharacterValidationService: UppercaseCharacterValidationService,
    private lowercaseCharacterValidationService: LowercaseCharacterValidationService,
    private min6CharactersValidationService: Min6CharactersValidationService
  ) { }

  hidePassword = true;
  isLoading = false;
  logged = false;

  form = this.fb.group({
    email: [null, [Validators.required, Validators.email],  [this.userExistsValidationService.userExists()]],
    password: [null, Validators.compose([Validators.required ,
      this.specialCharacterValidationService.noSpecialCharacter(),
      this.numberCharacterValidationService.numberCharacter(),
      this.uppercaseCharacterValidationService.noUppercaseCharacter(),
      this.lowercaseCharacterValidationService.noLowercaseCharacter(),
      this.min6CharactersValidationService.minLength6()
    ])],
    passwordConfirm: [null, Validators.required],
    name: [null, Validators.required]
  },{
    validators:[confirmPasswordEqualsValidator]
  })

  ngOnInit(): void {
  }

  signup(){
    let user = new User();

    user.name = this.form.get("name").value
    user.email = this.form.get("email").value
    user.password = this.form.get("password").value
    user.confirmPassword = this.form.get("passwordConfirm").value

    this.isLoading = true;

    this.userService.signup(user).subscribe({
      next: () => {
        this.isLoading = false;
        this.logged = true
        this.router.navigate(['login']);
      },
      error: () => {
        this.isLoading = false;
      }

    })
  }

  getTooltipText() {
    return `teste \n teste`;
  }
}
