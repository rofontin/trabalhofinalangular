import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChartType } from 'chart.js';
import { Grupo } from 'src/app/layout/grupo/models/grupo.model';
import { GrupoService } from 'src/app/layout/grupo/service/grupo.service';
import { ProdutoService } from 'src/app/layout/produto/service/produto.service';
import { DadoGrafico, InfoChartViewModel } from '../../model/home.model';

@Component({
  selector: 'app-chart-fontin',
  templateUrl: './chart-fontin.component.html',
  styleUrls: ['./chart-fontin.component.scss'],
})
export class ChartFontinComponent implements OnInit {
  titulo?: string = 'Produtos Por Grupos';

  typeChart: ChartType = 'bar';

  listaDados: DadoGrafico[] = [];

  @Output()
  onRefresh: EventEmitter<void> = new EventEmitter<void>();

  public produtosPorGrupo: InfoChartViewModel = {
    loading: true,
    datasets: [],
    labels: [],
  };

  constructor(
    private produtoService: ProdutoService,
    private grupoService: GrupoService
  ) {}

  ngOnInit() {
    this.buscarDadosGrafico();
  }

  atualizarDados(): void {
    this.onRefresh.emit();
  }

  private async buscarDadosGrafico(): Promise<void> {
    await this.grupoService.buscarTodos().toPromise().then((grupos) => {
        grupos.forEach(async (grupo) => {
          this.criarGraficoPorGrupo(grupo);
        });
      });

    this.produtosPorGrupo.loading = false;
  }

  private async criarGraficoPorGrupo(grupo: Grupo): Promise<void>{
    await this.produtoService.buscarPorGrupoId(grupo.id).toPromise().then((produtos) => {

      let dadosGrafico: DadoGrafico = {
        descricaoGrupo: grupo.descricao,
        quantidadeProduto: produtos.length,
      };

      this.listaDados.push(dadosGrafico);

      this.produtosPorGrupo.labels = this.listaDados.map((l) => l.descricaoGrupo);
      this.produtosPorGrupo.datasets = [
        {
          data: this.listaDados.map((l) => l.quantidadeProduto),
          label: 'Produto',
        },
      ];
    });
  }
}
