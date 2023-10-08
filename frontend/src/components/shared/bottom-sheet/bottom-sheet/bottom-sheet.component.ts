import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Type, ViewEncapsulation } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-bottom-sheet',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BottomSheetComponent implements OnInit {
  @Input() disableClose = true;
  @Input() autoFocus = true;
  @Input() useRouterOutlet = true;
  close = new EventEmitter<boolean>();
  data: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    public bottomSheet: MatBottomSheet,
  ) { }

  ngOnInit(): void {
    debugger;
    if (this.useRouterOutlet) {
      this.router.events.subscribe(ev => {
        if (ev instanceof NavigationEnd)
          this.open();
      });
      this.open();
    }
  }

  dismiss(): void {
    this.bottomSheet.dismiss();
  }

  open<T>(componentType?: Type<T>): void {
    if ((this.useRouterOutlet && this.activatedRoute.snapshot.children.length === 0) || (!this.useRouterOutlet && !componentType)) return;

    this.data = this.route.snapshot.children[0]?.data?.resolverData;

    debugger;

    const component: any = this.useRouterOutlet ? this.activatedRoute.snapshot.children[0].routeConfig?.component : componentType;
    const sheetRef = this.bottomSheet.open(component, {
      disableClose: this.disableClose,
      closeOnNavigation: false,
      autoFocus: this.autoFocus,
      data: this.data,
      panelClass: 'bottom-sheet-container',
    });

    sheetRef.keydownEvents().subscribe(e => {
      if (e.key?.toLowerCase() === 'escape')
        this.close.emit(true);
    });

    sheetRef.afterOpened().subscribe(() => {
      if ((sheetRef.instance as any).setData)
        (sheetRef.instance as any).setData(this.data);
    });
  }
}
