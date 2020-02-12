import {Component} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {CupomRepository} from '@src/sistema/domain/repository/cupom.repository';
import {ActivatedRoute, Router} from '@angular/router';
import {viewAnimation} from '../../../controls/utils';
import {Cupom} from '@src/sistema/domain/entity/assinatura/cupom.model';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';

/**
 *
 */
@Component({
  selector: 'inserir-cupom',
  templateUrl: './inserir-cupom.component.html',
  styleUrls: ['./inserir-cupom.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class InserirCupomComponent {

  /**
   *
   */
  public cupom: Cupom = new Cupom();

  /**
   *
   * @param {MatSnackBar} toastService
   * @param {CupomRepository} cupomRepository
   * @param {Router} router
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(private activatedRoute: ActivatedRoute,
              private cupomRepository: CupomRepository,
              private toastService: ToastService, private router: Router) {
  }

  /**
   *
   */
  public save($event): void {
    this.cupomRepository.save($event).then(() => {
      this.success('Cupom inserido com sucesso!')
    })
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute})
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
    this.toastService.open(message, 'Fechar', {
      duration: 5000
    })
  }
}
