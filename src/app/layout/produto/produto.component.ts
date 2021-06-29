import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Produto } from './models/produto.model';
import { ProdutoService } from './service/produto.service';
import { ProdutoModalComponent } from './componentes/produto-modal.component';
import { MatTableDataSource, _MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})

export class ProdutoComponent implements OnInit {

  produtos: Produto[] = [];
  produtosSearch: Produto[] = [];
  searchControl: FormControl = new FormControl();

  dataSource: _MatTableDataSource<Produto> = new MatTableDataSource<Produto>();
  displayedColumns = ['id', 'descricao', 'ativo', 'estoque','grupo','custo','venda', 'action'];

  // Para todos os service que o componente for usar precisa ser injetado recebendo pelo construtor
  constructor(
    private toastr: ToastrService,
    private produtoService: ProdutoService,
    private modalService: NgbModal
  ) {

    // pega os valueChange do campo de pesquisa, ai toda vez que o usuário digitar no campo irá cair e nós filtramos o usuário pelo nome
    // debounceTime(500) => cria um timeOut para entrar no subscribe apenas quando o usuário para de digitar após 0.5segundos
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {

        // Chama a função para filtrar os usuarios
        this.filtrarProdutos(value.toLocaleLowerCase());

      });

      this.dataSource.filterPredicate = (data: Produto, filter: string): boolean =>
      data.descricao.toLocaleLowerCase().includes(filter) ||
      data.id!.toString().includes(filter);
  }

  ngOnInit(): void {
    // Quando iniciar a tela carrega os usuários através da api
    this.carregaProdutosFromApi();

  }

  private filtrarProdutos(value: string): void {
    // Filtra os usuário e responde no array de usuários filtrados
    this.dataSource.filter = value;
  }

  private carregaProdutosFromApi(): void {
    // Chama o service de usuarios para buscar todos
    //    .buscarTodos() retorna um Observable<Usuario[]>
    //    como a chamada é assincrona para capturar o resultado é preciso "se inscrever" para receber o retorno

    this.produtoService.buscarTodos()
      .subscribe(result => {
        // pega o retorno recebido pela api e joga na nossa lista de usuários
        this.produtos = result;
        this.dataSource.data = result;

        // Chama a função para filtrar os usuários para trazer toda a lista
        this.filtrarProdutos('');

      }, error => {
        // Deu erro na requisição
        this.toastr.error(error.message, 'Ops.');
      });
  }

  public abrirModal(produto: Produto | undefined): void {
    // Instancia o modal
    const modalRef = this.modalService.open(ProdutoModalComponent, { size: 'lg' });

    // Passa o parâmetro do usuário para dentro
    modalRef.componentInstance.produto = produto;

    // Pega a resposta quando o usuário salvar no modal
    modalRef.componentInstance.onSave.subscribe((result: Produto) => {
      this.toastr.success('Produto salvo com sucesso!');

      if (!produto?.id) {
        // Se não tiver id no usuário de entrada então é uma insert
        this.produtos.push(result);
      } else {
        // Remove o usuário anterior e insere o novo
        const idx = this.produtos.findIndex(p => p.id === result!.id);
        this.produtos.splice(idx, 1, result);
      }
      this.limpaPesquisa();
    });

    // Pega a resposta quando o usuário excluír no modal
    modalRef.componentInstance.onDelete.subscribe(() => {
      this.toastr.success('Produto excluído com sucesso!');

      // Acha o usuário no array inicial e demove ele
      const idx = this.produtos.findIndex(p => p.id === produto!.id);
      this.produtos.splice(idx, 1);
      this.limpaPesquisa();
    });
  }

  private limpaPesquisa(): void {
    this.searchControl?.setValue('');
  }
}
