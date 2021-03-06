import {AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';

import {Endereco} from '../../../entity/endereco/endereco.model';
import {textMasks} from '../text-masks/text-masks';
import {AuthenticationService} from '../../../service/authentication.service';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {EnderecoService} from '../../../service/endereco.service';
import {Cidade} from '../../../entity/endereco/cidade.model';


@Component({
  selector: 'maps-component',
  templateUrl: 'maps.component.html',
  styleUrls: ['maps.component.css'],
})
export class MapsComponent implements OnInit, AfterViewInit {

  /**
   *
   */
  @Input() form: any;

  /**
   *
   */
  @ViewChild('autocomplete')
  inputAutocomplete;

  /**
   *
   */
  @Input()
  showMap = true;

  /**
   *
   */
  @Input()
  endereco: Endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);

  /**
   *
   */
  cidadeNotFind: Boolean;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
  authenticatedUser: any;

  /**
   *
   */
  @Input()
  myAddresOption: boolean;

  /**
   *
   */
  viewLoaded = false;

  /**
   *
   */
  userSubscription: any;

  /**
   *
   */
  cidadeAux: string;

  /**
   *
   * @param {EnderecoService} enderecoService
   * @param {AuthenticationService} authenticationService
   * @param {NgZone} _zone
   * @param {ChangeDetectorRef} changeDetectionRef
   * @param {FormBuilder} fb
   */
  constructor(public enderecoService: EnderecoService, public authenticationService: AuthenticationService, /*public _loader: MapsAPILoader,*/ public _zone: NgZone, public changeDetectionRef: ChangeDetectorRef, public fb: FormBuilder) {
    this.userSubscription = authenticationService.contaAutenticadaChanged.subscribe((user) => {
      this.authenticatedUser = user;
    });
  }

  /**
   *
   */
  ngOnInit(): void {

    if (!this.endereco)
      this.endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);

    if (!this.endereco.cidade)
      this.endereco.cidade = new Cidade();

    const formGroup = new FormGroup({
      logradouro: new FormControl('logradouro'),
      numero: new FormControl('numero'),
      bairro: new FormControl('bairro'),
      cidade: new FormControl('cidade', []),
      estado: new FormControl('estado', this.estadoObrigatorio())
    });

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('endereco', formGroup);

  }

  /**
   *
   */
  private estadoObrigatorio(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: any } => {
      if (this.endereco.cidade.nome && !c.value ) return {
        exception: 'Estado obrigatório'
      };
    }
  }


  /**
   *
   */
  ngAfterViewInit() {
    this.viewLoaded = true;
    this.changeDetectionRef.detectChanges()
  }

  /**
   *
   * @param {string} cep
   */
  public getAdressByCep(cep: string) {
    if (cep)
      this.enderecoService.getAdressByCep(cep)
        .then(result => {
          this.endereco.bairro = result.bairro;
          this.endereco.logradouro = result.logradouro;
          this.cidadeAux = result.cidade;
          this.findCidadeByNomeAndEstadoUf(result.cidade, result.estado)
        });
  }

  /**
   *
   */
  public validateEstado() {
    (this.form.controls.endereco.controls['estado'] as FormControl).updateValueAndValidity()
  }

  /**
   *
   * @param cidade
   * @param estado
   */
  public findCidadeByNomeAndEstadoUf(cidade, estado) {
    if (cidade && estado) {
      this.enderecoService.find(cidade, estado)
        .then(result => {
          if (result) {
            if (this.cidadeAux && this.cidadeAux.toLocaleLowerCase() !== result.nome.toLocaleLowerCase()) {
              this.endereco.cep = null;
            }

            this.endereco.cidade = result;
            this.endereco.cidade.estado = result.estado;
            this.cidadeNotFind = false;
            this.form.get('endereco').get('cidade').setErrors(null);
          } else {
            this.cidadeNotFind = true;
            this.form.get('endereco').get('cidade').setErrors({exception: 'Cidade não encontrada'})
          }
        })
        .catch(exception => {
          this.cidadeNotFind = true;
          this.form.get('endereco').get('cidade').setErrors({exception: 'Cidade não encontrada'})
        });
    }
  }

}
