import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { ProdutoRoutingModule } from './produto-routing.module';
import { ProdutoComponent } from './produto.component';
import { ProdutoModalComponent } from './componentes/produto-modal.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { HomeModule } from '../home/home.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ProdutoRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ToastrModule,
    TextMaskModule,
    CurrencyMaskModule,
    HomeModule,
    NgSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  declarations: [
    ProdutoComponent,
    ProdutoModalComponent
  ],
  entryComponents: [
    ProdutoModalComponent
  ]
})
export class ProdutoModule { }
