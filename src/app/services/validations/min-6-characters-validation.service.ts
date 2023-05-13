import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class Min6CharactersValidationService {

  minLength6(){
    return (control: AbstractControl): { [key: string]: boolean } => {
      if (!control.value) {
        return {minLength6Error: true};
      }

      if(control.value && control.value.length < 6){
        return {minLength6Error: true};
      } else{
        return null;
      }
    };
  }
}
