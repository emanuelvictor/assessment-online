import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer} from "@angular/core";
import 'rxjs/add/operator/toPromise';
import {textMasks} from "../../../../../../application/controls/text-masks/text-masks";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material";
import {Entrada} from "../../../../../entity/entrada/entrada.model";
import {UsuarioService} from "../../../../../service/usuario.service";
import {Usuario} from "../../../../../entity/usuario/usuario.model";
import {AreaAtuacao} from "../../../../../entity/fornecedor/area-atuacao.model";
import {AuthenticationService} from "../../../../../service/authentication.service";
import {PontoColetaService} from "../../../../../service/ponto-coleta.service";
import {Ficha} from "../../../../../entity/fornecedor/ficha.model";
import {FichaService} from "../../../../../service/ficha.service";


/**
 *
 */
@Component({
  selector: 'entrada-form',
  templateUrl: './entrada-form.component.html',
  styleUrls: ['./entrada-form.component.css']
})
export class EntradaFormComponent implements OnInit {

  /**
   *
   * @type {boolean}
   */
  public contaminado: boolean = false;
  /**
   *
   * @type {Usuario}
   */
  loggedUser: Usuario = new Usuario();

  /**
   *
   */
  public pontoColetaSelected: any = [];

  /**
   *
   */
  public pontosColetaList: any[];

  /**
   *
   */
  informacoesGeraisForm: FormGroup;

  /**
   *
   * @type {Ficha}
   */
  ficha: Ficha = new Ficha();

  /**
   *
   */
  form: any;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
  @Output()
  save: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @type {Entrada}
   */
  @Input()
  entrada: Entrada;

  /**
   *
   * @param {ElementRef} element
   * @param {AuthenticationService} authenticationService
   * @param {MatSnackBar} snackBar
   * @param {FormBuilder} fb
   * @param {UsuarioService} usuarioService
   * @param {PontoColetaService} pontoColetaService
   * @param {Renderer} renderer
   * @param {FichaService} fichaService
   */
  constructor(@Inject(ElementRef) public element: ElementRef,
              public authenticationService: AuthenticationService,
              public snackBar: MatSnackBar, public fb: FormBuilder,
              public usuarioService: UsuarioService, public pontoColetaService: PontoColetaService,
              public renderer: Renderer, public fichaService: FichaService) {
  }

  /**
   *
   */
  ngOnInit() {
    if (!this.entrada.ficha) {
      this.entrada.ficha = new Ficha();
      this.entrada.ficha.areaAtuacao = new AreaAtuacao();
    } else if (this.entrada.ficha.id) {
      this.ficha = this.entrada.ficha;
    }

    if (this.entrada.pontoColeta) {
      this.addPontoColeta(this.entrada.pontoColeta);
      this.pontoColetaSelected.push(this.entrada.pontoColeta);
    }

    this.authenticationService.getPromiseAuthenticatedUser().then(result => {
      this.loggedUser = result;
      if (this.loggedUser.perfil != 'ADMINISTRADOR' && this.loggedUser.perfil === 'COOPERADOR') {
        this.addPontoColeta(this.loggedUser.pontoColeta);
        // Adiciona no array para exibir na view
        this.pontoColetaSelected.push(this.entrada.pontoColeta);
      }
    });

    if (this.entrada.nivelContaminacao) {
      this.contaminado = true;
    }

    /**
     * Formulários
     * @type {FormGroup}
     */
    this.informacoesGeraisForm = this.fb.group({
      ficha: ['ficha', [Validators.required, Validators.min(1), (control: FormControl) => {
        return this.checkFicha(control);
      }]],
      peso: ['peso', [Validators.required, Validators.min(1)]]
    });

    this.form = this.fb.group({
      informacoesGeraisForm: this.informacoesGeraisForm
    });
  }

  /**
   *
   * @param {FormControl} control
   */
  checkFicha(control: FormControl): void {
    if (control.value > 0){
      this.fichaService.findOne(control.value).then(result => {
        if (!result) {
          control.setErrors({notfound: {exception: 'Resource not found'}});
        }
      });
    }
  }

  /**
   *
   */
  public saveEntrada(form: any): void {
    // TODO provisório
    let valid = true;
    let controls: any = [];
    Object.keys(form.controls).map(function (key) {
      if (form.controls[key].invalid) {
        let control = form.controls[key];
        control.key = '#' + key;
        if (control.controls) {
          Object.keys(control.controls).map(function (key) {
            if (control.controls[key].invalid) {
              let controlInner = control.controls[key];
              controlInner.key = '#' + key;
              controls.push(controlInner);
            }
          });
        }
        else {
          controls.push(control);
        }
      }
    });

    for (let control of controls) {
      if (control) {
        const element = this.element.nativeElement.querySelector(control.key);
        if (element && control.invalid) {
          this.renderer.invokeElementMethod(element, 'focus', []);
          valid = false;
          if (control.errors.exception)
            this.error(control.errors.exception);
          break;
        }
        if (control.controls && control.invalid) {
          for (let controlInner of control.controls) {
            const element = this.element.nativeElement.querySelector(controlInner.key);
            if (element && controlInner.invalid) {
              this.renderer.invokeElementMethod(element, 'focus', []);
              valid = false;
              if (controlInner.errors.exception)
                this.error(controlInner.errors.exception);
              break;
            }
          }
        }
      }
    }

    if (valid) {
      if (!this.entrada.pontoColeta) {
        this.error('Selecione um ponto do coleta');
        return;
      }

      if (!this.entrada.ficha.areaAtuacao || !this.entrada.ficha.areaAtuacao.fornecedor) {
        this.error('Ficha não encontrada');
        return;
      }

      if (!this.contaminado) {
        this.entrada.nivelContaminacao = 0;
      }

      this.save.emit(this.entrada);
    }
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message);
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }

  /**
   *
   * @param pontoColeta
   */
  public addPontoColeta(pontoColeta: any) {
    this.entrada.pontoColeta = pontoColeta;
  }

  /**
   *
   */
  public removePontoColeta() {
    this.entrada.pontoColeta = null;
  }

  /**
   *
   */
  public findPontosColeta(filter: string) {
    if (this.pontoColetaSelected.length < 1) {
      this.pontoColetaService.find(filter, filter, {size: 150, page: 0, sort: null})
        .then((result) => {
          this.pontosColetaList = result.content;
        })
    }
    else {
      this.pontosColetaList = [];
    }
  }

  /**
   * Procura a ficha pelo código
   * @param {number} fichaId
   */
  findFicha(fichaId: number): void {
    if (fichaId) {
      this.fichaService.findOne(fichaId).then(result => {
        this.entrada.ficha = result;
      })
    }

    if (!fichaId && !this.entrada.ficha) {
      this.entrada.ficha = new Ficha();
    }

    if (!fichaId && this.entrada.ficha) {
      this.entrada.ficha = new Ficha();
    }
  }

  /**
   * Alteração da contaminação
   * @param {boolean} contaminado
   */
  changeContaminado(contaminado: boolean) {
    if (contaminado && (!this.entrada.nivelContaminacao || this.entrada.nivelContaminacao == 0)) {
      /**
       * Define papel como o tipo de resíduo padrão
       * @type {string}
       */
      this.entrada.nivelContaminacao = 1;
    }
  }
}
