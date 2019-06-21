import {Component, ElementRef, Inject, OnInit, Renderer} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import {MobileService} from "../../../../../service/mobile.service";
import {AuthenticationService} from "../../../../../../../web/domain/service/authentication.service";
import {Router} from "@angular/router";
import {Agrupador} from "../../../../../../../web/domain/entity/avaliacao/agrupador.model";
import {FormBuilder, Validators} from "@angular/forms";
import {TdLoadingService} from "@covalent/core";
import {Subject} from "rxjs";
import {viewAnimation} from "../../../../../../../web/domain/presentation/controls/utils";

@Component({
  selector: 'authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class AuthenticateComponent implements OnInit {

  /**
   *
   */
  password: string;

  /**
   *
   */
  form: any;

  /**
   *
   * @type {Subject<string>}
   */
  public modelChanged: Subject<any> = new Subject<any>();

  /**
   *
   * @param fb
   * @param {MobileService} mobileService
   * @param _loadingService
   * @param element
   * @param renderer
   * @param snackBar
   * @param {AuthenticationService} authenticationService
   * @param {Router} router
   */
  constructor(private mobileService: MobileService,
              private _loadingService: TdLoadingService,
              @Inject(ElementRef) private element: ElementRef,
              private router: Router, private renderer: Renderer,
              private authenticationService: AuthenticationService,
              private snackBar: MatSnackBar, private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit(): void {
    // Registra o loading.
    this._loadingService.register('overlayStarSyntax');

    // Requisita as unidades
    this.mobileService.requestUnidades().then(unidades => {

      // Se não tem unidades selecionadas
      if (!unidades || !unidades.length) {
        this.router.navigate(['/configuracoes/opcoes-de-configuracao']);
        this._loadingService.resolve('overlayStarSyntax');
        return
      }

      // Se não tem unidades unidadesTiposAvaliacoes
      this.mobileService.requestUnidadesTiposAvaliacoes().then(unidadesTiposAvaliacoes => {

        // Se não tem unidadesTiposAvaliacoes selecionadas
        if (!unidadesTiposAvaliacoes || !unidadesTiposAvaliacoes.length) {
          this._loadingService.resolve('overlayStarSyntax');
          this.router.navigate(['/configuracoes/opcoes-de-configuracao']);
          return
        }

        // Requisita configuração
        this.mobileService.requestConfiguracao.then(() => {
          this._loadingService.resolve('overlayStarSyntax');
          this.mobileService.restartTimeout()
        })
      })
    });


    // Debounce da digitação, toda vez que o usuário digita alguma coisa, depois de 300 milisegundos ele executa isso.
    this.modelChanged.debounceTime(300).subscribe(() => {

      // Restarta o timeout
      this.mobileService.restartTimeout()
    });

    //
    this.form = this.fb.group({
      password: ['password', [Validators.required]]
    })
  }

  /**
   *
   */
  public authenticatePromise(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.mobileService.unidades.forEach(unidade => {
        this.authenticationService.authenticateByUnidade(unidade.id, this.password)
          .then(() => {

            resolve(true)

          }).catch(() => reject(false))
      })
    })
  }

  /**
   *
   */
  public authenticate(form: any): void {
    // TODO provisório
    let valid = true;
    const controls: any = [];
    Object.keys(form.controls).map(function (key) {
      if (form.controls[key].invalid) {
        const control = form.controls[key];
        control.key = '#' + key;
        if (control.controls) {
          Object.keys(control.controls).map(function (innerKey) {
            if (control.controls[innerKey].invalid) {
              const controlInner = control.controls[innerKey];
              controlInner.key = '#' + innerKey;
              controls.push(controlInner);
            }
          });
        } else {
          controls.push(control);
        }
      }
    });

    for (const control of controls) {
      if (control) {
        const element = this.element.nativeElement.querySelector(control.key);
        if (element && control.invalid) {
          this.renderer.invokeElementMethod(element, 'focus', []);
          valid = false;
          if (control.errors.exception) {
            this.error(control.errors.exception);
          }
          break;
        }
        if (control.controls && control.invalid) {
          for (const controlInner of control.controls) {
            const elemento = this.element.nativeElement.querySelector(controlInner.key);
            if (elemento && controlInner.invalid) {
              this.renderer.invokeElementMethod(elemento, 'focus', []);
              valid = false;
              if (controlInner.errors.exception) {
                this.error(controlInner.errors.exception);
              }
              break;
            }
          }
        }
      }
    }

    if (valid) {
      this.authenticatePromise().then(() => {

        this.mobileService.agrupador = new Agrupador();

        this.router.navigate(['/configuracoes/opcoes-de-configuracao'])

      })
    }
  }

  /**
   *
   */
  cancelar() {
    this.mobileService.agrupador = new Agrupador();
    this.router.navigate(['/avaliar'])
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message)
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    })
  }

}
