import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemindersRoutingModule } from './reminders-routing.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RemindersRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class RemindersModule { }
