import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UppercaseCharacterValidationService {

  noUppercaseCharacter(){

    const regex = /\p{Lu}/u;

    return (control: AbstractControl): { [key: string]: boolean } => {
      if (!control.value) {
        return {noUppercaseCharacter: true};
      }

      const valid = regex.test(control.value);

      return valid ? null : {noUppercaseCharacter: true};
    };
  }
}
