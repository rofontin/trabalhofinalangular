import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Grupo } from './models/grupo.model';
import { GrupoService } from './service/grupo.service';
import { GrupoModalComponent } from './componentes/grupo-modal.component';
import { MatTableDataSource, _MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.scss']
})
export class GrupoComponent implements OnInit {

  grupos: Grupo[] = [];
  gruposSearch: Grupo[] = [];
  searchControl: FormControl = new FormControl();

  dataSource: _MatTableDataSource<Grupo> = new MatTableDataSource<Grupo>();
  displayedColumns = ['id', 'descricao', 'action'];

  // Para todos os service que o componente for usar precisa ser injetado recebendo pelo construtor
  constructor(
    private toastr: ToastrService,
    private grupoService: GrupoService,
    private modalService: NgbModal
  ) {

    // pega os valueChange do campo de pesquisa, ai toda vez que o usuário digitar no campo irá cair e nós filtramos o usuário pelo nome
    // debounceTime(500) => cria um timeOut para entrar no subscribe apenas quando o usuário para de digitar após 0.5segundos
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {

        // Chama a função para filtrar os usuarios
        this.filtrarGrupos(value.toLocaleLowerCase());

      });

      this.dataSource.filterPredicate = (data: Grupo, filter: string): boolean =>
      data.descricao.toLocaleLowerCase().includes(filter) ||
      data.id!.toString().includes(filter);
  }

  ngOnInit(): void {
    // Quando iniciar a tela carrega os usuários através da api
    this.carregaGruposFromApi();

  }

  private filtrarGrupos(value: string): void {
    // Filtra os usuário e responde no array de clientes filtrados
    this.dataSource.filter = value;
  }

  private carregaGruposFromApi(): void {
    // Chama o service de clientes para buscar todos
    //    .buscarTodos() retorna um Observable<Cliente[]>
    //    como a chamada é assincrona para capturar o resultado é preciso "se inscrever" para receber o retorno

    this.grupoService.buscarTodos()
      .subscribe(result => {
        // pega o retorno recebido pela api e joga na nossa lista
        this.grupos = result;
        this.dataSource.data = result;

        // Chama a função para filtrar para trazer toda a lista
        this.filtrarGrupos('');

      }, error => {
        // Deu erro na requisição
        this.toastr.error(error.message, 'Ops.');
      });
  }

  public abrirModal(grupo: Grupo | undefined): void {
    // Instancia o modal
    const modalRef = this.modalService.open(GrupoModalComponent, { size: 'lg' });

    // Passa o parâmetro do cliente para dentro
    modalRef.componentInstance.grupo = grupo;

    // Pega a resposta quando o usuário salvar no modal
    modalRef.componentInstance.onSave.subscribe((result: Grupo) => {
      this.toastr.success('Grupo salvo com sucesso!');

      if (!grupo?.id) {
        // Se não tiver id no cliente de entrada então é uma insert
        this.grupos.push(result);
      } else {
        // Remove o cliente anterior e insere o novo
        const idx = this.grupos.findIndex(g => g.id === result!.id);
        this.grupos.splice(idx, 1, result);
      }
      this.limpaPesquisa();
    });

    // Pega a resposta quando o usuário excluír no modal
    modalRef.componentInstance.onDelete.subscribe(() => {
      this.toastr.success('Grupo excluído com sucesso!');

      // Acha o usuário no array inicial e demove ele
      const idx = this.grupos.findIndex(g => g.id === grupo!.id);
      this.grupos.splice(idx, 1);
      this.limpaPesquisa();
    });
  }

  private limpaPesquisa(): void {
    this.searchControl?.setValue('');
  }

}
