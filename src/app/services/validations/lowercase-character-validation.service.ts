import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LowercaseCharacterValidationService {

  noLowercaseCharacter(){
    const regex = /[a-z]/;

    return (control: AbstractControl): { [key: string]: boolean } => {
      if (!control.value) {
        return {noLowercaseCharacter: true};
      }

      const valid = regex.test(control.value);

      return valid ? null : {noLowercaseCharacter: true};
    };
  }
}
