import {AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild} from "@angular/core";

import {Endereco} from "../../../domain/entity/endereco/endereco.model";
import {textMasks} from "../text-masks/text-masks";
import {AuthenticationService} from "../../../domain/service/authentication.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Cidade} from "../../../domain/entity/endereco/cidade.model";
import {EnderecoService} from "../../../domain/service/endereco.service";
import {Estado} from "../../../domain/entity/endereco/estado.model";
import {Pais} from "../../../domain/entity/endereco/pais.model";


@Component({
  selector: 'maps-component',
  templateUrl: 'maps.component.html',
  styleUrls: ['maps.component.css'],
})
export class MapsComponent implements OnInit, AfterViewInit
{

  /*-------------------------------------------------------------------
  *                           ATTRIBUTES
  *-------------------------------------------------------------------*/
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
  endereco: Endereco;

  /**
   *
   */
  zoom: number = 13;

  /**
   *
   */
  address = {};

  /**
   *
   */
  extend = {};

  /**
   *
   */
  cidadeNotFind: Boolean;

  /**
   *
   */
  wasSearched: Boolean = false;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
  componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    administrative_area_level_2: 'long_name',
    administrative_area_level_1: 'short_name',
    postal_code: 'short_name',
    sublocality_level_1: 'short_name'
  };

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

  /*-------------------------------------------------------------------
  *                           CONSTRUCTOR
  *-------------------------------------------------------------------*/

  constructor(public enderecoService: EnderecoService, public authenticationService: AuthenticationService, /*public _loader: MapsAPILoader,*/ public _zone: NgZone, public changeDetectionRef : ChangeDetectorRef, public fb: FormBuilder)
  {
    this.userSubscription = authenticationService.authenticatedUserChanged.subscribe((user) =>
    {
      this.authenticatedUser = user;
    });
  }



  /*-------------------------------------------------------------------
  *                           BEHAVIORS
  *-------------------------------------------------------------------*/

  /**
   *
   */
  ngOnInit(): void
  {
    const formGroup = new FormGroup({
      logradouro : new FormControl('logradouro', Validators.required),
      numero : new FormControl('numero', Validators.required),
      bairro : new FormControl('bairro', Validators.required),
      cidade : new FormControl('cidade', [Validators.required]),
      estado : new FormControl('estado', Validators.required)
    });

    if (!this.form)
    {
      this.form = this.fb.group({});
    }

    this.form.addControl( 'endereco', formGroup);

    if (!this.endereco)
    {
      this.endereco = new Endereco("", "", "", "", "", new Cidade(), 0, 0);
    }

    if(!this.endereco.cidade || !this.endereco.cidade.estado)
    {
      this.endereco.cidade = new Cidade();
    }

    if (!this.endereco || !Object.keys(this.endereco).length)
    {
      if (!Object.keys(this.endereco).length)
      {
        this.endereco.cidade = new Cidade();
      } else {
        this.endereco = new Endereco("", "", "", "", "", new Cidade(), 0, 0);
      }
    }

    this.endereco.cidade.estado = new Estado();
    this.endereco.cidade.estado.pais = new Pais();

    // this.getExtend();

    // this.autocomplete();

    // this.getAuthenticatedUser();

    /**
     *
     * Popula endereço inicialmente com dados do paraná
     */
    this.findCidadeByNomeAndEstadoUf('Foz Do Iguaçu', 'PR');
  }

  /**
   *
   */
  ngAfterViewInit()
  {
    this.viewLoaded = true;
    this.changeDetectionRef.detectChanges();
  }

  /**
   *
   */
  public getAuthenticatedUser(): void
  {
    this.authenticationService.getPromiseAuthenticatedUser()
      .then((result) =>
      {
        if (result)
        {
          this.authenticatedUser = result;
        }
      })
  }

  /**
   *
   */
  // public autocomplete()
  // {
  //   this._loader.load().then(() =>
  //   {
  //     let autocomplete = new google.maps.places.Autocomplete(this.inputAutocomplete.nativeElement, {});
  //
  //     google.maps.event.addListener(autocomplete, 'place_changed', () =>
  //     {
  //       this._zone.run(() =>
  //       {
  //         this.wasSearched = true;
  //
  //         let place = autocomplete.getPlace();
  //
  //         // Limpa o campo de search
  //         this.inputAutocomplete.nativeElement.value = "";
  //
  //         if (place.geometry)
  //         {
  //           this.zoom = 15;
  //           this.endereco.latitude = place.geometry.location.lat();
  //           this.endereco.longitude = place.geometry.location.lng();
  //
  //           this.getExtend();
  //
  //           this.address = {};
  //
  //           // Get each component of the address from the place details
  //           // and fill the corresponding field on the form.
  //           for (let i = 0; i < place.address_components.length; i++)
  //           {
  //             let addressType = place.address_components[i].types[0];
  //             if (this.componentForm[addressType])
  //             {
  //               this.address[addressType] = place.address_components[i][this.componentForm[addressType]];
  //             }
  //           }
  //
  //           this.parseEndereco(this.address);
  //           this.findCidadeByNomeAndEstadoUf(this.endereco.cidade.nome, this.endereco.cidade.estado.uf);
  //         }
  //         if (!this.endereco.cidade)
  //         {
  //           this.endereco.cidade = new Cidade();
  //           this.endereco.cidade.estado = new Estado();
  //           this.endereco.cidade.estado.pais = new Pais();
  //         }
  //         if (!this.endereco.cidade.estado || !this.endereco.cidade.estado.uf)
  //         {
  //           this.endereco.cidade.estado = new Estado();
  //           this.endereco.cidade.estado.pais = new Pais();
  //         }
  //       });
  //     });
  //   });
  // }

  /**
   *
   */
  public findCidadeByNomeAndEstadoUf(cidade, uf)
  {
    if (cidade && uf)
    {
      this.enderecoService.find(cidade, uf)
        .then((result) =>
        {
          if (result)
          {
            this.endereco.cidade = result;
            this.cidadeNotFind = false;
            this.form.get('endereco').get('cidade').setErrors(null);
          }
          else
          {
            this.cidadeNotFind = true;
            this.form.get('endereco').get('cidade').setErrors({exception:'Cidade não encontrada'})
          }
        }).catch((exception) =>
      {
        this.cidadeNotFind = true;
        this.form.get('endereco').get('cidade').setErrors({exception:'Cidade não encontrada'})
      });
    }
  }

  /**
   *
   */
  public findCidade(cidade, uf)
  {
    this.findCidadeByNomeAndEstadoUf(cidade, uf);
  }

  /**
   *
   * @param address
   */
  public parseEndereco(address)
  {
    this.endereco.numero = address.street_number ? address.street_number : "";
    this.endereco.logradouro = address.route ? address.route : "";
    this.endereco.cep = address.postal_code ? address.postal_code : "";
    this.endereco.cidade = new Cidade();
    this.endereco.cidade.nome = address.administrative_area_level_2 ? address.administrative_area_level_2 : "";
    this.endereco.cidade.estado = new Estado();
    this.endereco.cidade.estado.uf = address.administrative_area_level_1 ? address.administrative_area_level_1 : "";
    this.endereco.bairro = address.sublocality_level_1 ? address.sublocality_level_1 : "";
  }

  /**
   *
   */
  public getExtend()
  {
    this.extend = {
      latitude: this.endereco.latitude ? this.endereco.latitude : -25.514861,
      longitude: this.endereco.longitude ? this.endereco.longitude : -54.568438
    }
  }

  /**
   *
   * @param event
   */
  public markerDragEnd(event)
  {
    this.endereco.latitude = event.coords.lat;
    this.endereco.longitude = event.coords.lng;
  }

  /**
   *
   */
  public fillWithMyAddress()
  {
    this.endereco.logradouro = this.authenticatedUser.endereco.logradouro;
    this.endereco.numero = this.authenticatedUser.endereco.numero;
    this.endereco.bairro = this.authenticatedUser.endereco.bairro;
    this.endereco.cep = this.authenticatedUser.endereco.cep;
    this.endereco.cidade = this.authenticatedUser.endereco.cidade;
    this.endereco.complemento = this.authenticatedUser.endereco.complemento;
  }

  ngOnDestroy()
  {
    if(this.userSubscription) this.userSubscription.unsubscribe();
  }
}
