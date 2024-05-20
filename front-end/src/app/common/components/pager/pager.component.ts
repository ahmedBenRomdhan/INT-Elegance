import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DataTablePagerComponent as SuperDataTablePagerComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-datatable-pager',
  templateUrl: './pager.component.html',
  host: {
    class: 'datatable-pager'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PagerComponent extends SuperDataTablePagerComponent {
  @Input() pagerLeftArrowIcon = 'datatable-icon-left';
  @Input() pagerRightArrowIcon = 'datatable-icon-right';
  @Input() pagerPreviousIcon = 'datatable-icon-prev';
  @Input() pagerNextIcon = 'datatable-icon-skip';


  @Input()
  // @ts-ignore

  set size(val: number) {
    this._size = val;
    this.pages = this.calcPages();
  }

  get size(): number {
    return this._size;
  }

  // @ts-ignore
  @Input()
  // @ts-ignore

  set count(val: number) {
    this._count = val;
    this.pages = this.calcPages();
  }

  get count(): number {
    return this._count;
  }

  @Input()
  set currentP(val: number) {
    this._curP = val;
    this._page = val;
  }
  get currentP(): number {
    return this._curP;
  }

  @Input()
  // @ts-ignore

  set page(val: number) {
    this._page = val;
    this.pages = this.calcPages();
  }

  get page(): number {
    return this._page;
  }

  // @ts-ignore
  get totalPages(): number {
    const count = this.size < 1 ? 1 : Math.ceil(this.count / this.size);
    return Math.max(count || 0, 1);
  }

  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() changeCurrent: EventEmitter<any> = new EventEmitter();

  _visiblePagesCount = 3;

  @Input()
  set visiblePagesCount(val: number) {
    this._visiblePagesCount = val;
    this.pages = this.calcPages();
  }

  get visiblePagesCount(): number {
    return this._visiblePagesCount;
  }

  _count = 0;
  _page = 1;
  _size = 0;
  pages: any;
  _curP = 1;

  canPrevious(): boolean {
    return this.page > 1;
  }

  canNext(): boolean {
    return this.page < this.totalPages;
  }

  prevPage(): void {
    this.selectPage(this.page - 1);
  }

  nextPage(): void {
    this.selectPage(this.page + 1);
  }

  selectPage(page: number): void {
    if (page > 0 && page <= this.totalPages && page !== this.page) {
      this.page = page;
      this.changeCurrent.emit({page});
      this.change.emit({page});
    }

  }

  calcPages(page?: number): any[] {
    const pages = [];
    let startPage = 1;
    let endPage = this.totalPages;
    const maxSize = this.visiblePagesCount;
    const isMaxSized = maxSize < this.totalPages;

    page = page || this.page;

    if (isMaxSized) {
      startPage = page - Math.floor(maxSize / 2);
      endPage = page + Math.floor(maxSize / 2);

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(startPage + maxSize - 1, this.totalPages);
      } else if (endPage > this.totalPages) {
        startPage = Math.max(this.totalPages - maxSize + 1, 1);
        endPage = this.totalPages;
      }
    }

    for (let num = startPage; num <= endPage; num++) {
      pages.push({
        number: num,
        text: <string><any>num
      });
    }

    return pages;
  }
}
