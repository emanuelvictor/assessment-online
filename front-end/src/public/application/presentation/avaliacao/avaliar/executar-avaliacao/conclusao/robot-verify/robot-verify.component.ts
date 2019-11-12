import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RecaptchaComponent} from 'ng-recaptcha';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {viewAnimation} from '@src/web/application/presentation/controls/utils';
import {PublicService} from '@src/public/domain/service/public.service';
import {UsuarioRepository} from '@src/web/domain/repository/usuario.repository';

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
  @ViewChild('reCaptcha', {static: false})
  reCaptcha: RecaptchaComponent;

  /**
   *
   * @param publicService
   * @param activatedRoute
   * @param usuarioRepository
   * @param router
   * @param fb
   */
  constructor(public publicService: PublicService,
              private activatedRoute: ActivatedRoute,
              private usuarioRepository: UsuarioRepository,
              private router: Router, private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit() {
    // Registra o loading e restarta o timeout
    this.publicService.register('overlayStarSyntax');
    this.publicService.restartTimeout(120000);

    this.form = this.fb.group({
      recaptchaReactive: ['recaptchaReactive', [Validators.required]]
    });

    // Requisita key para o google recaptcha
    this.usuarioRepository.getSiteKey().subscribe(result => {
      this.publicService.agrupador.siteKey = result;
      // Resolve o loading.
      this.publicService.resolve('overlayStarSyntax')
    })
  }


  /**
   *
   * @param {string} captchaResponse
   */
  resolved(captchaResponse: string) {
    this.publicService.agrupador.recap = captchaResponse;
    this.router.navigate(['avaliar/' + this.publicService.dispositivo.numeroLicenca + '/' + this.activatedRoute.parent.parent.snapshot.params.unidadeId + '/conclusao'])
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
    this.publicService.resolve('overlayStarSyntax')
  }
}
