import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {FormBuilder, Validators} from "@angular/forms";
import {textMasks} from "../../../../../../application/controls/text-masks/text-masks";
import {UnidadeService} from "../../../../../service/unidade.service";
import {Usuario} from '../../../../../entity/usuario/usuario.model';

/**
 *
 */
@Component({
  selector: 'usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class AtendenteFormComponent implements OnInit {

  /**
   *
   */
  public unidadeSelected: any = [];

  /**
   *
   */
  public unidadesList: any[];

  /**
   *
   */
  form: any;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
  @Output()
  save: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @type {Usuario}
   */
  @Input()
  usuario: Usuario;

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {FormBuilder} fb
   * @param {ElementRef} element
   * @param {Renderer} renderer
   * @param {UnidadeService} unidadeService
   */
  constructor(public snackBar: MatSnackBar, public fb: FormBuilder, @Inject(ElementRef) public element: ElementRef, public renderer: Renderer, public unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {

    /**
     * Se tem usuario, ou seja, se está editando, busca a unidade dele
     */
    if (this.usuario && this.usuario.key){
      // this.unidadeService.findOne(this.usuario.unidade.key).subscribe(result => { TODO
      //   this.unidadeSelected = [];
      //   this.unidadeSelected.push(result);
      // });
    }

    /**
     * Sobscreve para pegar lista de unidades inicial
     */
    this.unidadeService.find().subscribe((result) => {
      this.unidadesList = result;
    });

    this.form = this.fb.group({
      nome: ['nome', [Validators.required]],
      email: ['email', [Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]]
    });
  }

  /**
   *
   */
  public saveAtendente(form: any): void {
    // TODO provisório
    let valid = true;
    let controls: any = [];
    Object.keys(form.controls).map(function (key) {
      if (form.controls[key].invalid) {
        let control = form.controls[key];
        control.key = '#' + key;
        if (control.controls) {
          Object.keys(control.controls).map(function (key) {
            if (control.controls[key].invalid) {
              let controlInner = control.controls[key];
              controlInner.key = '#' + key;
              controls.push(controlInner);
            }
          });
        }
        else {
          controls.push(control);
        }
      }
    });

    for (let control of controls) {
      if (control) {
        const element = this.element.nativeElement.querySelector(control.key);
        if (element && control.invalid) {
          this.renderer.invokeElementMethod(element, 'focus', []);
          valid = false;
          if (control.errors.exception)
            this.error(control.errors.exception);
          break;
        }
        if (control.controls && control.invalid) {
          for (let controlInner of control.controls) {
            const element = this.element.nativeElement.querySelector(controlInner.key);
            if (element && controlInner.invalid) {
              this.renderer.invokeElementMethod(element, 'focus', []);
              valid = false;
              if (controlInner.errors.exception)
                this.error(controlInner.errors.exception);
              break;
            }
          }
        }
      }
    }

    if (valid) {
      // if (!this.usuario.unidade || !this.usuario.unidade.key){ todo
      //   this.error('Selecione uma unidade');
      //   return;
      // }

      this.save.emit(this.usuario);
    }
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message);
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }


  /**
   *
   * @param unidade
   */
  public addUnidade(unidade: any) {
    // this.usuario.unidade = unidade; todo
    // this.unidadeService.find().subscribe().unsubscribe();
    // this.unidadesList = [];
  }

  /**
   *
   */
  public removeUnidade() {
    // this.usuario.unidade = null; todo
    //
    // this.unidadeService.find().subscribe((result) => {
    //   this.unidadesList = result;
    // });
  }
}