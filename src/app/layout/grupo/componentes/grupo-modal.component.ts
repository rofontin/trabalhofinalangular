import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { hasErrors, validateAllFormFields } from 'src/app/shared/helpers/iu.helper';
import { Grupo } from '../models/grupo.model';
import { GrupoService } from '../service/grupo.service';
import { ProdutoService } from '../../produto/service/produto.service';
import { Produto } from '../../produto/models/produto.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-grupo-modal',
  templateUrl: './grupo-modal.component.html',
  styleUrls: ['./grupo-modal.component.scss']
})
export class GrupoModalComponent implements OnInit {

  @Input()
  grupo: Grupo | undefined;

  @Output()
  onSave: EventEmitter<Grupo> = new EventEmitter<Grupo>();

  @Output()
  onDelete: EventEmitter<void> = new EventEmitter<void>();

  formGroup?: FormGroup;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private grupoService: GrupoService,
    private produtoService: ProdutoService
  ) { }

  ngOnInit(): void {
    this.createForm(this.grupo || {} as Grupo);
  }

  createForm(grupo: Grupo) {
    this.formGroup = this.formBuilder.group({
      descricao: [
        grupo.descricao,
        Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])
      ]
    });
  }

  public salvar(): void {
    if (this.formGroup?.invalid) {
      this.toastr.error('Campos inválidos ou não preenchidos!');
      validateAllFormFields(this.formGroup);
      return;
    }

    // Pega as informações que estão no formGroup (que são os campos da tela)
    const grupoForm = this.formGroup?.getRawValue();
    // Faz o merge dos objeto cliente inicial com os campos alterados na tela
    const grupo = { ...this.grupo, ...grupoForm };

    // Chama o service para salvar na API
    this.grupoService.salvar(grupo)
      .subscribe(result => {
        // Emite o evento que salvou com sucesso e passa o cliente que retornou do serviço atualizado
        this.onSave.emit(result);

        // Fecha o modal
        this.activeModal.close();
      }, error => {
        this.toastr.error(error.message);
      });

  }

  public async excluir(): Promise<void>{
    const produtos = await this.produtoService.buscarPorGrupoId(this.grupo!.id!).toPromise()
      if(produtos.length === 0){
        this.grupoService.excluir(this.grupo!.id!).subscribe(() => {
          // Emite o evento que excluiu
          this.onDelete.emit();

          // Fecha o modal
          this.activeModal.close();
        },
        (error) => {
          this.toastr.error(error.message);
        }
      );
    } else {
      this.toastr.error('Existe produtos cadastrados para esse grupo!');
      return;
    }
  }

  public getControl(controlName: string): AbstractControl {
    return this.formGroup?.get(controlName)!;
  }

  hasErrors = hasErrors;

}
