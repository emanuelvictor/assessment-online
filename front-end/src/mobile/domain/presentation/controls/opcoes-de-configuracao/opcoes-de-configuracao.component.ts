import {Component, ElementRef, Inject, OnInit, Renderer} from "@angular/core";
import {MatBottomSheetRef, MatSnackBar} from "@angular/material";
import {MobileService} from "../../../service/mobile.service";
import {AuthenticationService} from "../../../../../web/domain/service/authentication.service";
import {Router} from "@angular/router";
import {Agrupador} from "../../../../../web/domain/entity/avaliacao/agrupador.model";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'opcoes-de-configuracao',
  templateUrl: './opcoes-de-configuracao.component.html',
  styleUrls: ['./opcoes-de-configuracao.component.scss']
})
export class OpcoesDeConfiguracaoComponent implements OnInit {

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
   * @param fb
   * @param {MobileService} mobileService
   * @param element
   * @param renderer
   * @param snackBar
   * @param {AuthenticationService} authenticationService
   * @param {Router} router
   * @param _bottomSheetRef
   */
  constructor(private mobileService: MobileService,
              @Inject(ElementRef) private element: ElementRef,
              private router: Router, private renderer: Renderer,
              private authenticationService: AuthenticationService,
              private snackBar: MatSnackBar, private fb: FormBuilder,
              private _bottomSheetRef: MatBottomSheetRef<OpcoesDeConfiguracaoComponent>) {
  }

  /**
   *
   */
  ngOnInit(): void {
    this.form = this.fb.group({
      password: ['password', [Validators.required]]
    });
  }

  /**
   *
   */
  public authenticate(): Promise<boolean> {
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
  public logout(form: any): void {
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
      this.authenticate().then(() => {
        this.authenticationService.logout().then(() => {

          this._bottomSheetRef.dismiss();
          this.mobileService.agrupador = new Agrupador();
          this.mobileService.restartTimeout();

          this.router.navigate(['authentication'])

        })
      })
    }
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
