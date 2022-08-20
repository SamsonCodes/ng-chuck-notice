import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditUserComponent } from './components/edit-user/edit-user.component';

import { UsersComponent } from './components/users/users.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { LoginComponent } from './components/login/login.component';
import { ProtectedComponent as ProtectedComponent } from './components/protected/protected.component';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full'},
  { path: 'users', component: UsersComponent },
  { path: 'tasks', component:TasksComponent },
  { path: 'edit-user/:id', component: EditUserComponent },
  { path: 'edit-task/:id', component: EditTaskComponent },
  { path: 'login', component: LoginComponent},
  { 
    path: 'protected', 
    component: ProtectedComponent,
    canActivate: [IsAuthenticatedGuard]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
