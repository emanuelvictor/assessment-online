import {MatIconRegistry, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {DomSanitizer} from '@angular/platform-browser';
import {UnidadeService} from '../../../../service/unidade.service';
import {textMasks} from '../../../controls/text-masks/text-masks';
import 'moment/locale/pt-br';
import {Configuracao} from "../../../../entity/configuracao/configuracao.model";
import {ConfiguracaoService} from "../../../../service/configuracao.service";
import {UsuarioService} from "../../../../service/usuario.service";
import {TipoAvaliacaoRepository} from "../../../../repositories/tipo-avaliacao.repository";

@Component({
  selector: 'consultar-tipos-avaliacoes',
  templateUrl: './consultar-tipos-avaliacoes.component.html',
  styleUrls: ['./consultar-tipos-avaliacoes.component.css']
})
export class ConsultarTiposAvaliacoesComponent implements OnInit {

  /**
   *
   * @type {Configuracao}
   */
  configuracao: Configuracao;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
  public showPesquisaAvancada = false;

  /**
   *
   */
  public pageRequest = { // PageRequest
    size: 20,
    page: 0,
    sort: null,
    defaultFilter: [],
    unidadesFilter: [],
  };

  /**
   * Serve para armazenar o total de elementos
   */
  public page: any = {};

  /**
   * Serve para armazenar as colunas que serão exibidas na tabela
   */
  public displayedColumns: string[] =
    [
      'nome',
      'enunciado',
      'um',
      'dois',
      'tres',
      'quatro',
      'cinco'
    ];

  /**
   *
   * dataSource com os usuários
   * @type {MatTableDataSource<Usuario>}
   */
  dataSource = new MatTableDataSource<Usuario>();

  /**
   * Bind com o objeto paginator
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Bind com objeto sort
   */
  @ViewChild(MatSort) sort: MatSort;

  filteredAsync: string[];
  asyncModel: string[] = [];
  filteredAsyncUsuario: string[];

  /**
   *
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {UsuarioService} usuarioService
   * @param {UnidadeService} unidadeService
   * @param {ConfiguracaoService} configuracaoService
   * @param {TipoAvaliacaoRepository} tipoAvaliacaoRepository
   */
  constructor(private domSanitizer: DomSanitizer,
              private iconRegistry: MatIconRegistry,
              private usuarioService: UsuarioService,
              private unidadeService: UnidadeService,
              private configuracaoService: ConfiguracaoService,
              private tipoAvaliacaoRepository: TipoAvaliacaoRepository) {

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'media', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/baseline-bar_chart-24px.svg'));

  }

  /**
   *
   */
  ngOnInit() {

    /**
     * Carrega configurações
     */
    this.configuracaoService.configuracao.subscribe(result => this.configuracao = result);

    /**
     * Seta o size do pageRequest no size do paginator
     * @type {number}
     */
    this.paginator.pageSize = this.pageRequest.size;

    /**
     * Listagem inicial
     */
    this.listAvaliacoesByFilters(this.pageRequest);

    /**
     * Sobrescreve o sortChange do sort bindado
     */
    this.sort.sortChange.subscribe(() => {
      this.pageRequest.sort = {
        'properties': this.sort.active,
        'direction': this.sort.direction
      };
      this.listAvaliacoesByFilters(this.pageRequest);
    });
  }

  /**
   * Chamado ao alterar algum filtro
   *
   */
  public onChangeFilters() {

    this.pageRequest.page = 0;

    this.pageRequest.unidadesFilter = this.asyncModel.map((result: any) => result.id);

    this.tipoAvaliacaoRepository.listByFilters(this.pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Usuario>(result.content);

        this.page = result;
      })

  }

  /**
   * Consulta de usuarios
   *
   */
  public listAvaliacoesByFilters(pageRequest: any) {

    pageRequest.unidadesFilter.concat(this.asyncModel.map((result: any) => result.id));

    pageRequest.page = this.paginator.pageIndex;
    pageRequest.size = this.paginator.pageSize;

    this.tipoAvaliacaoRepository.listByFilters(pageRequest)
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource<Usuario>(result.content);
        this.page = result;
      })
  }

  /**
   *
   * @param value
   */
  filterAsync(value: string): void {
    this.filteredAsync = undefined;
    if (value) {

      const pageRequest = { // PageRequest
        size: 20,
        page: 0,
        sort: null,
        defaultFilter: [] = [value]
      };

      this.unidadeService.listLightByFilters(pageRequest)
        .subscribe((result) => {
          this.filteredAsync = result.content;
        });

    }
  }
}
