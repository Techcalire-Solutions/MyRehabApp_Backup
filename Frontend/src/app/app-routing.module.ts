import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Modules/guards/auth.guard';

const routes: Routes = [
  {path:'',loadChildren:()=>import('./Modules/auth/auth.module').then(x=>x.AuthModule)},
  {path:'admin',loadChildren:()=>import('./Modules/admin/admin.module').then(x=>x.AdminModule),canActivate:[AuthGuard]},
  {path:'therapist',loadChildren:()=>import('./Modules/therapist/therapist.module').then(x=>x.TherapistModule),canActivate:[AuthGuard]},
  {path:'parent',loadChildren:()=>import('./Modules/parent/parent.module').then(x=>x.ParentModule),canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
