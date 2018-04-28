import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {UnidadeService} from '../../../../../web/domain/service/unidade.service';
import {AuthenticationService} from '../../../../../web/domain/service/authentication.service';
import {UsuarioService} from '../../../../../web/domain/service/usuario.service';
import {ColaboradorService} from '../../../../../web/domain/service/colaborador.service';

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
   * @param {MobileService} mobileService
   * @param {UnidadeService} unidadeService
   */
  constructor(private router: Router, private mobileService: MobileService, private unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.unidadeService.find()
      .subscribe(unidades => {
        this.unidades = unidades;
      });
  }

  /**
   *
   * @param unidade
   */
  selecionar(unidade) {
    this.mobileService.setUnidade(unidade.key);
    this.router.navigate(['avaliar']);
  }
}
