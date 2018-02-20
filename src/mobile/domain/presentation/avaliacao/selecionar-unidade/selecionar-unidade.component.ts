import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AvaliacaoService} from '../AvaliacaoService';
import {UnidadeService} from "../../../../../web/domain/service/unidade.service";
import {AuthenticationService} from "../../../../../web/domain/service/authentication.service";
import {UsuarioService} from "../../../../../web/domain/service/usuario.service";
import {ColaboradorService} from "../../../../../web/domain/service/colaborador.service";

@Component({
  selector: 'selecionar-unidade',
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
   * @param {ColaboradorService} colaboradorService
   * @param {AvaliacaoService} avaliacaoService
   * @param {UnidadeService} unidadeService
   */
  constructor(private usuarioService: UsuarioService, private authenticationService: AuthenticationService, private router: Router, private colaboradorService: ColaboradorService, private avaliacaoService: AvaliacaoService, private unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.usuarioService.findUsuarioByEmail(this.authenticationService.getAuthenticatedUser().email).subscribe(usuario => {
      this.colaboradorService.findColaboradorByUsuarioKey(usuario.key).subscribe(colaboradores => {
        colaboradores.forEach(colaborador => {
          this.unidades = [];
          if (colaborador.vinculo)
            this.unidadeService.findOne(colaborador.unidade.key).subscribe(unidade => {
              this.unidades.push(unidade);
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
    this.avaliacaoService.setUnidade(unidade.key);
    this.router.navigate(['avaliar']);
  }
}
