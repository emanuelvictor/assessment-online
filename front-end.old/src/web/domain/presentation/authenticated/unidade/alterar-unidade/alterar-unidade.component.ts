import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {ActivatedRoute, Router} from '@angular/router';
import {Unidade} from '../../../../entity/unidade/unidade.model';
import {UnidadeService} from '../../../../service/unidade.service';
import {Endereco} from '../../../../entity/endereco/endereco.model';
import {Cidade} from '../../../../entity/endereco/cidade.model';

/**
 *
 */
@Component({
  selector: 'alterar-ponto-coleta',
  templateUrl: './alterar-unidade.component.html',
  styleUrls: ['./alterar-unidade.component.css']
})
export class AlterarUnidadeComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {SnapshotAction}
   */
  unidade: Unidade = new Unidade();

  /**
   *
   * @param {ActivatedRoute} activatedRoute
   * @param {UnidadeService} unidadeService
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   */
  constructor(public activatedRoute: ActivatedRoute,
              public unidadeService: UnidadeService,
              public router: Router, public snackBar: MatSnackBar) {
  }

  /**
   *
   */
  ngOnInit() {
    const id: number = this.activatedRoute.snapshot.params['id'];
    this.findById(id);
  }

  /**
   *
   * @param id
   */
  public findById(id: number) {
    this.unidadeService.findById(id)
      .subscribe(result => {

        this.unidade = result;

        if (this.unidade && this.unidade.endereco)
          if (typeof this.unidade.endereco === 'string')
            this.unidade.endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);

      })
  }

  /**
   *
   */
  public save(unidade: Unidade): void {
    this.unidadeService.save(unidade)
      .then((result) => {
        unidade = result;
        this.success('Unidade alterada com sucesso');
      })
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['authenticated/unidades/' + this.unidade.id]);
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
