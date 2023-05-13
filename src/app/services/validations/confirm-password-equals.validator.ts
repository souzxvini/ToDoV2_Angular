import { FormGroup } from '@angular/forms';
export function confirmPasswordEqualsValidator(form: FormGroup){
  const password = form.get('password')?.value ?? '';
  const passwordConfirm = form.get('passwordConfirm')?.value ?? '';

  if(password.trim() + passwordConfirm.trim()){
    return password == passwordConfirm ? null:{diferentPassword: true}
  } else {
    return null;
  }
}
