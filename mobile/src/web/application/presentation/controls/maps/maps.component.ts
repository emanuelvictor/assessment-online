import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';

import {Endereco} from '../../../../domain/entity/endereco/endereco.model';
import {textMasks} from '../text-masks/text-masks';
import {AuthenticationService} from '../../../../domain/service/authentication.service';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {EnderecoService} from '../../../../domain/service/endereco.service';
import {Cidade} from '../../../../domain/entity/endereco/cidade.model';
import {obrigatorio} from '../validators/validators';


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
  @ViewChild('autocomplete', {static: false})
  inputAutocomplete;

  /**
   *
   */
  @Input()
  allRequired: boolean;

  /**
   *
   */
  @Input()
  endereco: Endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);

  /**
   *
   */
  @Output()
  enderecoChange: EventEmitter<Endereco> = new EventEmitter();

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

    if (!this.endereco) {
      this.endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);
    }

    if (!this.endereco.cidade) {
      this.endereco.cidade = new Cidade();
    }

    let formGroup;
    if (this.allRequired) {
      formGroup = new FormGroup({
        logradouro: new FormControl('logradouro', [obrigatorio('Logradouro obrigatório')]),
        numero: new FormControl('numero', [obrigatorio('Número obrigatório')]),
        bairro: new FormControl('bairro', [obrigatorio('Bairro obrigatório')]),
        cidade: new FormControl('cidade', [obrigatorio('Cidade obrigatório')]),
        estado: new FormControl('estado', this.estadoObrigatorio())
      });
    } else {
      formGroup = new FormGroup({
        logradouro: new FormControl('logradouro'),
        numero: new FormControl('numero'),
        bairro: new FormControl('bairro'),
        cidade: new FormControl('cidade', []),
        estado: new FormControl('estado', this.estadoObrigatorio())
      });
    }

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('endereco', formGroup);

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
    if (cep) {
      this.enderecoService.getAdressByCep(cep)
        .then(result => {
          this.endereco.bairro = result.bairro;
          this.endereco.logradouro = result.logradouro;
          this.cidadeAux = result.cidade;
          this.findCidadeByNomeAndEstadoUf(result.cidade, result.estado)
        });
    }
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

          this.enderecoChange.emit(this.endereco)
        })
        .catch(exception => {
          this.cidadeNotFind = true;
          this.form.get('endereco').get('cidade').setErrors({exception: 'Cidade não encontrada'})
        });
    }
  }

  /**
   *
   */
  private estadoObrigatorio(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: any } => {
      if (this.endereco.cidade.nome && !c.value) {
        return {
          exception: 'O estado é obrigatório'
        };
      }
    }
  }

}
