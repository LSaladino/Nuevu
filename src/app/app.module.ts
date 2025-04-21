import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MachineFleetComponent } from './components/machine-fleet/machine-fleet.component';
import { HomeComponent } from './components/layout/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';
import { MachineCreateComponent } from './components/machine-create/machine-create.component';


@NgModule({
  declarations: [
    AppComponent,
    MachineFleetComponent,
    HomeComponent,
    ConfirmDialogComponent,
    MachineCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-center-center',
      preventDuplicates:true,
      timeOut:3000,
      easing:'ease-in',
      easeTime:1000
    }),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
