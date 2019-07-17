import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component'
import { PostComponent } from './post/post.component'
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: '' , component: PostListComponent},
  { path: 'post', component: PostComponent},
  { path: 'about', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
