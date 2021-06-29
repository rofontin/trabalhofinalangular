import { Preco } from './../models/produto.model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { hasErrors, validateAllFormFields } from 'src/app/shared/helpers/iu.helper';
import { Produto } from '../models/produto.model';
import { ProdutoService } from '../service/produto.service';
import { Grupo } from '../../grupo/models/grupo.model';

@Component({
  selector: 'app-produto-modal',
  templateUrl: './produto-modal.component.html',
  styleUrls: ['./produto-modal.component.scss']
})
export class ProdutoModalComponent implements OnInit {

  @Input()
  produto: Produto | undefined;

  @Output()
  onSave: EventEmitter<Produto> = new EventEmitter<Produto>();

  @Output()
  onDelete: EventEmitter<void> = new EventEmitter<void>();

  formGroup?: FormGroup;

  public grupos: Grupo[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private produtoService: ProdutoService
  ) { }

  ngOnInit(): void {
    this.carregaGrupos();
    this.createForm(this.produto || {} as Produto);
  }

  private async carregaGrupos(): Promise<void> {
    this.grupos = await this.produtoService.buscarGrupos().toPromise();
  }

  createForm(produto: Produto) {
    this.formGroup = this.formBuilder.group({
      descricao: [
        produto.descricao,
        Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])
      ],
      ativo: [
        produto.ativo == undefined? false : produto.ativo
      ],
      estoque:[
        produto.estoque,
        Validators.compose([Validators.required, Validators.minLength(0), Validators.maxLength(999999999)])
      ],
      preco: this.createFormPreco(produto.preco || {}),
      grupoId:[
        produto.grupoId,
        Validators.compose([Validators.required])
      ]
    });
  }

  private createFormPreco(preco: Preco): FormGroup {
    return this.formBuilder.group({
      custo: [
        preco.custo,
        Validators.compose([Validators.required, Validators.minLength(0), Validators.maxLength(999999999)])
      ],
      venda: [
        preco.venda,
        Validators.compose([Validators.required, Validators.min(0.01), Validators.max(999999999)])
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
    const produtoForm = this.formGroup?.getRawValue();
    // Faz o merge dos objeto cliente inicial com os campos alterados na tela
    const produto = { ...this.produto, ...produtoForm };

    // Chama o service para salvar na API
    this.produtoService.salvar(produto)
      .subscribe(result => {
        // Emite o evento que salvou com sucesso e passa o cliente que retornou do serviço atualizado
        this.onSave.emit(result);

        // Fecha o modal
        this.activeModal.close();
      }, error => {
        this.toastr.error(error.message);
      });

  }

  public excluir(): void {
    this.produtoService.excluir(this.produto!.id!).subscribe(() => {
      // Emite o evento que excluiu
      this.onDelete.emit();

      // Fecha o modal
      this.activeModal.close();
    }, error => {
      this.toastr.error(error.message);
    });
  }

  public getControl(controlName: string): AbstractControl {
    return this.formGroup?.get(controlName)!;
  }

  hasErrors = hasErrors;

}
