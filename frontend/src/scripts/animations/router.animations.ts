import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'fixed', width: 'calc(100% - {{size}})' }), { optional: true }),
    group([
      query(
        ':enter',
        [style({ transform: 'translateY(100vh)' }), animate('0.5s ease-in-out', style({ transform: 'translateY(0vh)' }))],
        { optional: true },
      ),
      query(
        ':leave',
        [style({ transform: 'translateY(0vh)' }), animate('0.5s ease-in-out', style({ transform: 'translateY(100vh)' }))],
        { optional: true },
      ),
    ]),
  ]),
]);
