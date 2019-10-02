import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RecaptchaComponent} from "ng-recaptcha";
import {FormBuilder, Validators} from "@angular/forms";
import {MobileService} from "../../../../../../service/mobile.service";
import {viewAnimation} from "../../../../../../../../web/domain/presentation/controls/utils";
import {UsuarioRepository} from "../../../../../../../../web/domain/repository/usuario.repository";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'robot-verify',
  templateUrl: './robot-verify.component.html',
  styleUrls: ['./robot-verify.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class RobotVerifyComponent implements OnInit, OnDestroy {

  /**
   *
   */
  form: any;

  /**
   *
   */
  @ViewChild('reCaptcha')
  reCaptcha: RecaptchaComponent;

  /**
   *
   * @param mobileService
   * @param activatedRoute
   * @param usuarioRepository
   * @param router
   * @param fb
   */
  constructor(public mobileService: MobileService,
              private activatedRoute: ActivatedRoute,
              private usuarioRepository: UsuarioRepository,
              private router: Router, private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit() {
    // Registra o loading e restarta o timeout
    this.mobileService.register('overlayStarSyntax');
    this.mobileService.restartTimeout(120000);

    this.form = this.fb.group({
      recaptchaReactive: ['recaptchaReactive', [Validators.required]]
    });

    // Requisita key para o google recaptcha
    this.usuarioRepository.getSiteKey().subscribe(result => {
      this.mobileService.agrupador.siteKey = result;
      // Resolve o loading.
      this.mobileService.resolve('overlayStarSyntax')
    })
  }


  /**
   *
   * @param {string} captchaResponse
   */
  resolved(captchaResponse: string) {
    this.mobileService.agrupador.recap = captchaResponse;
    this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca + '/' + this.activatedRoute.parent.parent.snapshot.params.unidadeId + '/conclusao'])
  }

  /**
   *
   */
  reset() {
    this.reCaptcha.reset();
  }

  /**
   *
   */
  ngOnDestroy(): void {
    this.reset();
    // Resolve o loading.
    this.mobileService.resolve('overlayStarSyntax')
  }
}
