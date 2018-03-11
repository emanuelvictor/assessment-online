import {AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';

import {Endereco} from '../../../entity/endereco/Endereco.model';
import {textMasks} from '../text-masks/text-masks';
import {AuthenticationService} from '../../../service/authentication.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EnderecoService} from '../../../service/endereco.service';
import {exceptions} from '@angular-devkit/core/src/json/schema/serializers/javascript';
import {Cidade} from "../../../entity/endereco/Cidade.model";


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
  showMap: boolean = true;

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
  viewLoaded: boolean = false;

  /**
   *
   */
  userSubscription: any;

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

    // if (typeof this.endereco === 'string') {
    //   this.endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);
    // }
    //
    // if (!this.endereco.cidade || !this.endereco.cidade.estado) {
    //   this.endereco.cidade = new Cidade();
    // }
    //
    // if (!this.endereco || !Object.keys(this.endereco).length) {
    //   if (!Object.keys(this.endereco).length) {
    //     this.endereco.cidade = new Cidade();
    //   } else {
    //     this.endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);
    //   }
    // }
    //
    // this.endereco.cidade.estado = new Estado();
    // this.endereco.cidade.estado.pais = new Pais();

    // this.getExtend();

    // this.autocomplete();

    // this.getAuthenticatedUser();

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
   */
  public getAdressByCep(cep) {
    if (cep) {
      this.enderecoService.getAdressByCep(cep)
        .then((result) => {
          if (result) {
            this.endereco.cidade = result;
            this.cidadeNotFind = false;
            this.form.get('endereco').get('cidade').setErrors(null);
          }
          else {
            this.cidadeNotFind = true;
            this.form.get('endereco').get('cidade').setErrors({exception: 'Cidade não encontrada'})
          }
        }).catch((exception) => {
        this.cidadeNotFind = true;
        this.form.get('endereco').get('cidade').setErrors({exception: 'Cidade não encontrada'})
      });
    }
  }

  /**
   *
   * @param cidade
   * @param estado
   */
  public findCidadeByNomeAndEstadoUf(cidade, estado) {
    if (cidade && estado) {
      this.enderecoService.getEstados().then(estados => {

        let estadoId: number = 0;

        for (let i = 0; i < estados.length; i++) {
          if (estados[i].sigla.toLowerCase() === estado.toLowerCase() || estados[i].nome.toLowerCase().indexOf(estado.toLowerCase()) > -1) {
            /**
             * Encontrou o ID
             */
            estadoId = estados[i].id;
          }
        }

        if (!estadoId) return;

        this.enderecoService.getCidadeByEstadoId(estadoId)
          .then((cidades) => {
            if (cidades && cidades.length) {

              for (let i = 0; i < cidades.length; i++) {
                if (cidades[i].nome.toLowerCase().indexOf(cidade.toLowerCase()) > -1) {

                  this.endereco.cidade = cidades[i];
                  this.endereco.cidade.estado = cidades[i].microrregiao.mesorregiao.UF;
                  this.cidadeNotFind = false;
                  this.form.get('endereco').get('cidade').setErrors(null);
                }
              }
            } else {
              this.cidadeNotFind = true;
              this.form.get('endereco').get('cidade').setErrors({exception: 'Cidade não encontrada'})
            }
          }).catch((exception) => {
          this.cidadeNotFind = true;
          this.form.get('endereco').get('cidade').setErrors({exception: 'Cidade não encontrada'})
        });

      }).then(exceptions => {
        this.cidadeNotFind = true;
        this.form.get('endereco').get('cidade').setErrors({exception: 'Cidade não encontrada'})
      });
    }
  }

  /**
   *
   */
  public findCidade(cidade, estado) {
    this.findCidadeByNomeAndEstadoUf(cidade, estado);
  }
}
