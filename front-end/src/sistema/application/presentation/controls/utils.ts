import {Configuracao} from '../../../domain/entity/configuracao/configuracao.model';
import {animate, query, style, transition, trigger} from '@angular/animations';

/**
 *
 * @param enumerator
 */
export function enumToArrayString(enumerator): any {
  return Object.keys(enumerator).map(key => enumerator[key]).filter(value => typeof value === 'string') as string[]
}

export const single = [
  {
    'name': new Configuracao().um,
    'value': 0,
  },
  {
    'name': new Configuracao().dois,
    'value': 0,
  },
  {
    'name': new Configuracao().tres,
    'value': 0,
  },
  {
    'name': new Configuracao().quatro,
    'value': 0,
  },
  {
    'name': new Configuracao().cinco,
    'value': 0,
  }
];


export function getIdentifier(): string {
  return Math.floor(Math.random() * 2000).toString();
}

export const TOKEN_NAME = 'ubest-token';

export const PASSWORD_NAME = 'senha';

/**
 * -----------------------------------------------------------------------------------------
 *                                        Animações
 * -----------------------------------------------------------------------------------------
 *
 * Animação referente aos *ngIf
 *
 * <div [@fadeInOut]> </div>
 *
 *  @Component({
 *    selector: 'selector',
 *    templateUrl: './template.component.html',
 *    styleUrls: ['./style.component.css'],
 *    animations: [
 *      viewAnimation
 *    ]
 *  })
 *
 *
 */
export const viewAnimation = trigger('fadeInOut', [
  transition(':enter', [   // :enter is alias to 'void => *'
    style({opacity: 0}),
    animate(500, style({opacity: 1}))
  ]),
  transition(':leave', [   // :leave is alias to '* => void'
    animate(500, style({opacity: 0}))
  ])
]);

/**
 * Animação referente aos routerOutlet
 *
 * <main [@routerAnimation]="o.isActivated ? o.activatedRoute : ''">
 *    <router-outlet #o="outlet"></router-outlet>
 * </main>
 *
 *  @Component({
 *    selector: 'selector',
 *    templateUrl: './template.component.html',
 *    styleUrls: ['./style.component.css'],
 *    animations: [routerAnimation]
 *  })
 *
 */
export const routerAnimation = trigger('routerAnimation', [
  // The '* => *' will trigger the animation to change between any two states
  transition('* => *', [
    // The query function has three params.
    // First is the event, so this will apply on entering or when the element is added to the DOM.
    // Second is a list of styles or animations to apply.
    // Third we add a config object with optional set to true, this is to signal
    // angular that the animation may not apply as it may or may not be in the DOM.
    query(
      ':enter',
      [style({opacity: 0})],
      {optional: true}
    ),
    query(
      ':leave',
      // here we apply a style and use the animate function to apply the style over 0.3 seconds
      [style({opacity: 1}), animate('0.175s', style({opacity: 0}))],
      {optional: true}
    ),
    query(
      ':enter',
      [style({opacity: 0}), animate('0.175s', style({opacity: 1}))],
      {optional: true}
    )
  ])
]);
