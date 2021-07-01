import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ChartsModule } from 'ng2-charts';
import { DndModule } from 'ng2-dnd';
import { ChartFontinComponent } from './componentes/chart-fontin/chart-fontin.component';
import { CardComponent } from './componentes/card/card.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    HomeRoutingModule,
    ChartsModule,
    DndModule.forRoot()
  ],
  declarations: [
    HomeComponent,
    ChartFontinComponent,
    CardComponent
  ],
  exports: [

  ]
})
export class HomeModule { }
