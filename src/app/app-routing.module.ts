import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditUserFormComponent } from './components/edit-user-form/edit-user-form.component';

import { UsersComponent } from './components/users/users.component';
import { TasksComponent } from './components/tasks/tasks.component';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full'},
  { path: 'users', component: UsersComponent },
  { path: 'tasks', component:TasksComponent },
  { path: 'edit-user/:id', component: EditUserFormComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
