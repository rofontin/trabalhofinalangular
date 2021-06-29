import { HomeModule } from '../home/home.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { GrupoRoutingModule } from './grupo-routing.module';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { NgSelectModule } from '@ng-select/ng-select';
import { GrupoComponent } from './grupo.component';
import { GrupoModalComponent } from './componentes/grupo-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    GrupoRoutingModule,
    SharedModule,
    ToastrModule,
    TextMaskModule,
    CurrencyMaskModule,
    HomeModule,
    NgSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule
  ],
  declarations: [
    GrupoComponent,
    GrupoModalComponent
  ],
  entryComponents: [
    GrupoModalComponent
  ]
})
export class GrupoModule { }
