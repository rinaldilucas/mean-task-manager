import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
    transition('* <=> *', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' })
            , { optional: true }),
        group([
            query(':enter', [
                style({ transform: 'translateY(650%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateY(0)' }))
            ], { optional: true }),
            query(':leave', [
                style({ transform: 'translateY(0%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateY(650%)' }))
            ], { optional: true })
        ])
    ])
]);
