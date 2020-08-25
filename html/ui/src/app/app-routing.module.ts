import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeployManagerComponent } from './deploy-manager/deploy-manager.component';
import { ServerManagerComponent } from './server-manager/server-manager.component';
import { AuthentificationComponent } from './authentification/authentification.component';

const routes: Routes = [
  { path: 'deploy', component: DeployManagerComponent},
  { path: 'server_manage', component: ServerManagerComponent},
  { path: 'auth', component: AuthentificationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
