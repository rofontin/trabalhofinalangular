import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRestService } from 'src/app/shared/services/base-rest.service';
import { Preco, Produto } from '../models/produto.model';
import { Grupo } from '../../grupo/models/grupo.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService extends BaseRestService {

  public buscarTodos(): Observable<Produto[]> {
    return this.getter<Produto[]>('produtos').pipe(take(1));
  }

  public buscarTodosQuery(filtros: any): Observable<Produto[]> {
    // Verifica se tem os parâmetros e vai adicionando no array para jogar na URL
    const query = new Array<string>();
    if (filtros.id) {
      query.push(`id=${filtros.id}`);
    }
    if (filtros.descricao) {
      query.push(`descricao=${filtros.username}`);
    }

    const params = query.length > 0 ? '?' + query.join('&') : '';
    return this.getter<Produto[]>(`produtos?${params}`).pipe(take(1));
  }

  public buscarTodosQuery2(filtros: any): Observable<Produto[]> {
    const options = {
      params: this.parseObjectToHttpParams(filtros)
    };
    return this.getter<Produto[]>('produtos', options).pipe(take(1));
  }

  public buscarPorId(id: number): Observable<Produto> {
    return this.getter<Produto>(`produtos/${id}`).pipe(take(1));
  }

  public salvar(produto: Produto): Observable<Produto> {
    // Verifica se o usuário já tem ID, se tiver chama o PUT para atual, senão o POST para inserir
    if (produto.id) {
      return this.put<Produto>(`produtos/${produto.id}`, produto);

    } else {
      return this.post<Produto>('produtos', produto);
    }
  }

  public excluir(id: number): Observable<void> {
    return this.delete(`produtos/${id}`).pipe(take(1));
  }

  public buscarGrupos(): Observable<Grupo[]> {
    return this.getter<Grupo[]>('grupos').pipe(take(1));
  }

  public buscarPorGrupoId(grupoId: number): Observable<Produto[]> {
    return this.getter<Produto[]>(`produtos?grupoId=${grupoId}`).pipe(take(1));
  }

}
