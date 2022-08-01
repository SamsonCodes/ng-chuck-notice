import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditUserFormComponent } from './components/edit-user-form/edit-user-form.component';

import { UserFormComponent } from './components/user-form/user-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full'},
  { path: 'users', component: UserFormComponent },
  { path: 'edit-user/:id', component: EditUserFormComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
