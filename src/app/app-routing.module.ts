import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/layout/home/home.component';
import { MachineFleetComponent } from './components/machine-fleet/machine-fleet.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'machine-fleet', component: MachineFleetComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
