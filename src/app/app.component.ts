import { environment } from './../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Component, Inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private translateService: TranslateService
  ) {
    this.translateService.addLangs(['pt', 'en']);
    this.translateService.setDefaultLang('pt');

    if (localStorage.getItem('Language')) { // Se existir 'Language' no localstorage
      this.translateService.use(localStorage.getItem('Language'));
    } else { // Se não existir 'Language' no localstorage
      this.translateService.use('pt');
    }

    let theme = environment.TEMAS[0].value

    if(localStorage.getItem('ToDoV2Theme')){
      theme = localStorage.getItem('ToDoV2Theme')
    } else{
      localStorage.setItem('ToDoV2Theme', theme)
    }

    this.document.getElementById('theme').setAttribute('href', '../assets/css/themeStyle/' + theme + '.css'); // Define o CSS
   }

  isUserLoggedIn(){
    return this.authService.isUserSignedin();
  }

}
