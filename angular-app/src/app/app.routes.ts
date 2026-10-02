import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';
import { Students } from './students/students';
import { Teacher } from './teacher/teacher';
import { Attendance } from './attendance/attendance';
import { Fee } from './fee/fee';
import { Login } from './login/login';
import { authGuard } from './auth-guard';

export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },

  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'students',
    component: Students,
    canActivate: [authGuard]
  },

  {
    path: 'teacher',
    component: Teacher,
    canActivate: [authGuard]
  },

  {
    path: 'attendance',
    component: Attendance,
    canActivate: [authGuard]
  },

  {
    path: 'fee',
    component: Fee,
    canActivate: [authGuard]
  }

];