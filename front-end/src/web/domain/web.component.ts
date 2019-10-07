/**
 * Created by Emanuel Victor on 17/04/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: 'web-root',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['web.component.scss'],
})
export class WebComponent implements OnInit {

  /**
   *
   * Usado para fazer scroll até o topo da página
   */
  @ViewChild('top')
  topElement: any;

  /**
   *
   */
  currentUrl: any;

  /**
   *
   * @param {Router} router
   */
  constructor(public router: Router) {
  }

  /**
   *
   */
  ngOnInit() {
    /**
     * Sempre que trocar a rota,
     * faz o scroll para o inicio do scroll de todos os sidenav-containers
     * que é uma div criada pelo componente side-nav
     */
    this.router.events.subscribe((path: any) => {
      if (path.url !== this.currentUrl) {
        const scrollableElements = document.getElementsByClassName("mat-drawer-content");
        for (let i = 0; i < scrollableElements.length; i++) {
          scrollableElements[i].scrollTop = 0;
        }
        this.currentUrl = path.url;
      }
    });
  }
}