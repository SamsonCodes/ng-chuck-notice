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
import { NotKickedGuard } from './guards/not-kicked.guard';
import { KickedPageComponent } from './components/kicked-page/kicked-page.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { DailyJokePageComponent } from './components/daily-joke-page/daily-joke-page.component';

const routes: Routes = [
  { 
    path: '', 
    pathMatch: 'full',    
    redirectTo: '/daily-fact'
  },
  { 
    path: 'login', 
    component: LoginComponent
  },
  { 
    path: 'users', 
    component: UsersComponent,
    canActivate: [IsAuthenticatedGuard, IsAdminGuard, NotKickedGuard]
  },
  { 
    path: 'tasks', 
    component:TasksComponent,
    canActivate: [IsAuthenticatedGuard, NotKickedGuard]
  },
  { 
    path: 'edit-user/:id', 
    component: EditUserComponent,
    canActivate: [IsAuthenticatedGuard, IsAdminGuard, NotKickedGuard]
  },
  { 
    path: 'edit-task/:id', 
    component: EditTaskComponent,
    canActivate: [IsAuthenticatedGuard, IsAssignedGuard, NotKickedGuard]
  },
  { 
    path: 'about-page', 
    component: AboutPageComponent
  },
  { 
    path: 'kicked', 
    component: KickedPageComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  { 
    path: 'daily-fact', 
    component: DailyJokePageComponent,
    canActivate: [IsAuthenticatedGuard, NotKickedGuard]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
