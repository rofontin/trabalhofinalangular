import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageValidControlComponent } from './message-valid-control/message-valid-control.component';
import { CpfOrCnpjPipe, CpfPipe } from './pipes/cpf-pipe';
import { CepPipe } from './pipes/cep-pipe';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    MessageValidControlComponent,
    CpfPipe,
    CpfOrCnpjPipe,
    CepPipe
  ],
  exports: [
    MessageValidControlComponent,
    CpfPipe,
    CpfOrCnpjPipe,
    CepPipe
  ],
  entryComponents: [
    MessageValidControlComponent
  ]
})
export class SharedModule { }
