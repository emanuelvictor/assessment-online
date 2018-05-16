import {AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';

import {Endereco} from '../../../entity/endereco/Endereco.model';
import {textMasks} from '../text-masks/text-masks';
import {AuthenticationService} from '../../../service/authentication.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EnderecoService} from '../../../service/endereco.service';
import {Cidade} from '../../../entity/endereco/Cidade.model';


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
    this.userSubscription = authenticationService.authenticatedUserChanged.subscribe((user) => {
      this.authenticatedUser = user;
    });
  }

  /**
   *
   */
  ngOnInit(): void {
    const formGroup = new FormGroup({
      logradouro: new FormControl('logradouro', Validators.required),
      numero: new FormControl('numero', Validators.required),
      bairro: new FormControl('bairro', Validators.required),
      cidade: new FormControl('cidade', [Validators.required]),
      estado: new FormControl('estado', Validators.required)
    });

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('endereco', formGroup);

    /**
     *
     * Popula endereço inicialmente com dados do paraná
     */
    if (!this.endereco.numero)
      this.findCidadeByNomeAndEstadoUf('Foz Do Iguaçu', 'PR');
  }

  /**
   *
   */
  ngAfterViewInit() {
    this.viewLoaded = true;
    this.changeDetectionRef.detectChanges();
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
