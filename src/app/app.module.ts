import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { HomeComponent } from './views/home/home.component';
import { HeaderComponent } from './componentes/header/header.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './views/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { RegisterComponent } from './views/register/register.component';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import { TooltipListPipe } from './pipes/tooltip-list.pipe';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { TokenInterceptor } from './services/token/token-interceptor.interceptor';
import { ErrorComponent } from './views/error/error.component';
import {MatTableModule} from '@angular/material/table';
import { CreateCategoryModalComponent } from './componentes/header/modal/create-category-modal/create-category-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CategoryComponent } from './views/category/category.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MyFilterPipe } from './pipes/my-filter.pipe';
import { LengthPipe } from './pipes/length.pipe';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { SharedModule } from './shared/shared/shared.module';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ConfirmationDialogComponent } from './componentes/confirmation-dialog/confirmation-dialog.component';
// Translate (i18n) / Locale
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {MatChipsModule} from '@angular/material/chips';
import { RemindersComponent } from './views/reminders/reminders.component';
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    TooltipListPipe,
    ErrorComponent,
    CreateCategoryModalComponent,
    CategoryComponent,
    MyFilterPipe,
    LengthPipe,
    ConfirmationDialogComponent,
    RemindersComponent
  ],
  imports: [
    MatChipsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    NgbModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatCardModule,
    MatGridListModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTabsModule,
    SharedModule,
    MatPaginatorModule,
    MatDatepickerModule,
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: (http:HttpClient) => {
            return new TranslateHttpLoader(http, './assets/i18n/', '.json');
          },
          deps: [ HttpClient]
        }
      }
    ),
  ],
  providers: [
    DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: MAT_DATE_LOCALE, useValue: 'pt'}
    ,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
