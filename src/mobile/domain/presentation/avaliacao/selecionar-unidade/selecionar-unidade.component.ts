import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AvaliacaoService} from '../AvaliacaoService';
import {UnidadeService} from "../../../../../web/domain/service/unidade.service";
import {AtendenteService} from "../../../../../web/domain/service/atendente.service";
import {AuthenticationService} from "../../../../../web/domain/service/authentication.service";
import {UsuarioService} from "../../../../../web/domain/service/usuario.service";

@Component({
  selector: 'app-selecionar-unidade',
  templateUrl: './selecionar-unidade.component.html',
  styleUrls: ['./selecionar-unidade.component.scss']
})
export class SelecionarUnidadeComponent implements OnInit {

  /**
   *
   */
  model: any;

  /**
   *
   */
  unidades: any;

  /**
   *
   * @param {UsuarioService} usuarioService
   * @param {AuthenticationService} authenticationService
   * @param {Router} router
   * @param {AtendenteService} atendenteService
   * @param {AvaliacaoService} avaliacaoService
   * @param {UnidadeService} unidadeService
   */
  constructor(private usuarioService: UsuarioService, private authenticationService: AuthenticationService, private router: Router, private atendenteService: AtendenteService, private avaliacaoService: AvaliacaoService, private unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.usuarioService.findUsuarioByEmail(this.authenticationService.getAuthenticatedUser().email).subscribe(usuario => {
      this.atendenteService.findAtendenteByUsuarioKey(usuario.key).subscribe(atendentes => {
        atendentes.forEach(atendente => {
          this.unidades = [];
          if (atendente.vinculo)
            this.unidadeService.findOne(atendente.unidade.key).subscribe(unidade => {
              this.unidades.push(unidade);
              // this.avaliacaoService.getUnidades().push(unidade);
            })
        });
      })
    });
  }

  /**
   *
   * @param unidade
   */
  selecionar(unidade) {
    this.avaliacaoService.setUnidade(unidade);
    this.router.navigate(['avaliar']);
  }
}
