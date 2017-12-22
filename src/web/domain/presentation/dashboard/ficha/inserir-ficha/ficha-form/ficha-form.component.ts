import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer} from "@angular/core";
import 'rxjs/add/operator/toPromise';
import {textMasks} from "../../../../../../application/controls/text-masks/text-masks";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material";
import {UsuarioService} from "../../../../../service/usuario.service";
import {Usuario} from "../../../../../entity/usuario/usuario.model";
import {AreaAtuacao} from "../../../../../entity/fornecedor/area-atuacao.model";
import {AuthenticationService} from "../../../../../service/authentication.service";
import {Ficha} from "../../../../../entity/fornecedor/ficha.model";


/**
 *
 */
@Component({
  selector: 'ficha-form',
  templateUrl: './ficha-form.component.html',
  styleUrls: ['./ficha-form.component.css']
})
export class FichaFormComponent implements OnInit {

  /**
   *
   * @type {Usuario}
   */
  loggedUser: Usuario = new Usuario();

  /**
   *
   */
  public fornecedorSelected: any = [];

  /**
   *
   */
  public fornecedoresList: any[];

  /**
   *
   */
  public fornecedor: Usuario;
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
   * @type {Ficha}
   */
  @Input()
  ficha: Ficha;

  /**
   *
   * @param {ElementRef} element
   * @param {AuthenticationService} authenticationService
   * @param {MatSnackBar} snackBar
   * @param {FormBuilder} fb
   * @param {Renderer} renderer
   * @param {UsuarioService} usuarioService
   */
  constructor(@Inject(ElementRef) public element: ElementRef,
              public authenticationService: AuthenticationService,
              public snackBar: MatSnackBar, public fb: FormBuilder,
              public renderer: Renderer,
              public usuarioService: UsuarioService) {
  }

  /**
   *
   */
  ngOnInit() {

    if (!this.ficha.areaAtuacao) {
      this.ficha.areaAtuacao = new AreaAtuacao();
    }

    if (this.ficha.id) {
      this.fornecedorSelected.push(this.ficha.areaAtuacao.fornecedor);
      this.fornecedor = this.ficha.areaAtuacao.fornecedor;
      this.addFornecedor(this.fornecedor);
    }

    this.authenticationService.getPromiseAuthenticatedUser().then(result => {
      this.loggedUser = result;
      if (this.loggedUser.perfil != 'ADMINISTRADOR' && this.loggedUser.perfil === 'FORNECEDOR') {
        this.fornecedorSelected = [];
        this.fornecedorSelected.push(this.loggedUser);
        this.fornecedor = this.loggedUser;
        this.addFornecedor(this.fornecedor);
      }
    });

    this.form = this.fb.group({
      tipoResiduo: ['tipoResiduo', [Validators.required]]
    });
  }

  /**
   *
   * @returns {any}
   */
  getAreasAtuacao(): any {

    if (!this.ficha.id) {
      for (let areaAtuacao of this.fornecedor.areasAtuacao) {
        areaAtuacao.checked = false;
      }
    } else {
      for (let areaAtuacao of this.fornecedor.areasAtuacao) {
        if (areaAtuacao.id != this.ficha.areaAtuacao.id) {
          areaAtuacao.checked = false;
        }
      }
    }

    return this.fornecedor.areasAtuacao;
  }

  /**
   *
   */
  public saveFicha(form: any): void {
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
      this.ficha.areaAtuacao.fornecedor = new Usuario();
      this.ficha.areaAtuacao.fornecedor.documento = this.fornecedor.documento;
      this.save.emit(this.ficha);
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
   * @param {Usuario} fornecedor
   */
  public addFornecedor(fornecedor: Usuario) {
    this.fornecedor = fornecedor;
    this.usuarioService.findAreasAtuacaoChecked(this.fornecedor.id, null, null)
      .then(result => this.fornecedor.areasAtuacao = result.content);
  }

  /**
   *
   */
  public removeFornecedor() {
    this.fornecedor = null;
  }

  /**
   *
   * @param {string} filter
   */
  public findFornecedores(filter: string) {
    if (this.fornecedorSelected.length < 1) {
      this.usuarioService.find(filter, null, null, 'FORNECEDOR', {size: 150, page: 0, sort: null})
        .then((result) => {
          this.fornecedoresList = result.content;
        })
    }
    else {
      this.fornecedoresList = [];
    }
  }
}
