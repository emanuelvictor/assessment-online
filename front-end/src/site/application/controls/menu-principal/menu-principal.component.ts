import {Component, ElementRef, EventEmitter, HostListener} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { environment } from '../../../../environments/environment';

@Component({
  styleUrls: ['./menu-principal.component.scss'],
  selector: 'menu-principal',
  templateUrl: './menu-principal.component.html'
})
export class MenuPrincipalComponent {

  menuItems: MenuItem[];

  printMenu = false;

  constructor(public el: ElementRef, public activatedRoute: ActivatedRoute, private router: Router) {
    this.sidenavActions = new EventEmitter<any>();
    this.sidenavParams = [];
    this.menuItems = [
      {name: "Início", route: "/inicio"},
      {name: "Ao vivo", route: "/ao-vivo"},
      {name: "Testemunhos", route: "/testemunhos"},
      {name: "Ministério", route: "/ministerios"},
      {name: "Contato", route: "/contato"},
      {name: "Localização", route: "/localizacao"},
      {name: "Pr. Valdir Maia", route: "/pastores/valdir-maia"}
    ];
  }

  /**
   *
   */
  close() {
    this.sidenavActions.emit({action: 'sideNav', params: ['hide']});
  }

  /**
   *
   */
  toSystem(){
    if (environment.production)
      window.open('http://familiaredencao.org/sistema','_blank');
    else
      window.open('http://localhost:9000','_blank');
  }

  sidenavActions: EventEmitter<any>;
  sidenavParams: any[];

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    // const componentPosition = this.el.nativeElement.offsetTop;
    const scrollPosition = window.pageYOffset;

    this.printMenu = scrollPosition > 0;

  }
}

export interface MenuItem {
  name: string;
  route: string;
}
