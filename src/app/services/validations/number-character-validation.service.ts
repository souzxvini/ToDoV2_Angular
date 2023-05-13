import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class NumberCharacterValidationService {

  numberCharacter(){

    const regex = /\d/;

    return (control: AbstractControl): { [key: string]: boolean } => {
      if (!control.value) {
        return {noNumberCharacter: true};
      }

      const valid = regex.test(control.value);

      return valid ? null : {noNumberCharacter: true};
    };
  }
}
