import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent
  ],
  exports: [

  ]
})
export class HomeModule { }
