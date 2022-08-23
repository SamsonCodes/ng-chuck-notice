import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditUserComponent } from './components/edit-user/edit-user.component';

import { UsersComponent } from './components/users/users.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { LoginComponent } from './components/login/login.component';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { IsAdminGuard } from './guards/is-admin.guard';
import { IsAssignedGuard } from './guards/is-assigned.guard';
import { ExampleTableComponent } from './components/example-table/example-table.component';

const routes: Routes = [
  { 
    path: '', 
    pathMatch: 'full',    
    redirectTo: '/tasks'
  },
  { 
    path: 'login', 
    component: LoginComponent
  },
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
    path: 'example-table', 
    component: ExampleTableComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
