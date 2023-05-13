import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SpecialCharacterValidationService {

    noSpecialCharacter(){
    const regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    return (control: AbstractControl): { [key: string]: boolean } => {
      if (!control.value) {
        return {noSpecialCharacter: true};
      }

      const valid = regex.test(control.value);

      return valid ? null : {noSpecialCharacter: true};
    };
  }
}
