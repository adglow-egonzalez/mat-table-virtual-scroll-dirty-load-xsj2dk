import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CoreTable } from '../core-table/table';
import { Example } from './example';

@Component({
  selector: 'my-example-table',
  templateUrl: './example-table.component.html',
  styleUrls: ['./example-table.component.scss']
})
export class ExampleTableComponent extends CoreTable<Example> {
  @Input()
  set examples(examples: Example[]) {
    // sets dataSource on CoreTable
    this.set(examples);
  }

  @Input() sticky: boolean;

  offset: Observable<number>;
  transform: Observable<string>;

  constructor() {
    // column definitions for CoreTable
    super(['id', 'name', 'actions']);
  }

  // this is how you could recalculate the sticky header position on scroll.
  onInit() {
    const magicNumber = 632;
    // the magicNumber can be calculated using all of:
    // nativeElement.scrollTop; nativeElement.clientHeight; rowHeight; viewport.offset.
    // but it's a hassle so let's just fix a pretty ok one here
    this.offset = this.viewport.renderedRangeStream.pipe(
      map(() => Math.min(magicNumber, this.viewport.getOffsetToRenderedContentStart()))
    );

    this.transform = this.offset.pipe(
      map(offset => `translateY(-${offset}px)`)
    );
  }
}
