import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { first, map, switchMap } from 'rxjs';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class UserExistsValidationService {

  constructor(private http: HttpClient,
    private userService: UserService) { }

  userExists(){
      return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        switchMap((userEmail) =>
          this.userService.verifyExistentUser(userEmail)
        ),
        map((userExists) =>
          (userExists ? { existentUser: true } : null),
        ),
        first()
      );
    }
    }
}
