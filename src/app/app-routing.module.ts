import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditUserComponent } from './components/edit-user/edit-user.component';

import { UsersComponent } from './components/users/users.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { LoginComponent } from './components/login/login.component';
import { ProtectedComponent as ProtectedComponent } from './components/protected/protected.component';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { IsAdminGuard } from './guards/is-admin.guard';
import { IsAssignedGuard } from './guards/is-assigned.guard';

const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { 
    path: 'users', 
    component: UsersComponent,
    canActivate: [IsAuthenticatedGuard, IsAdminGuard]
  },
  { 
    path: 'tasks', 
    component:TasksComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  { 
    path: 'edit-user/:id', 
    component: EditUserComponent,
    canActivate: [IsAuthenticatedGuard, IsAdminGuard]
  },
  { 
    path: 'edit-task/:id', 
    component: EditTaskComponent,
    canActivate: [IsAuthenticatedGuard, IsAssignedGuard]
  },  
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
