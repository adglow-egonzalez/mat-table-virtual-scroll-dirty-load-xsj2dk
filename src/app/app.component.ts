import { Component } from '@angular/core';
import { Observable, of, interval } from 'rxjs';
import { delay, map, scan, shareReplay, startWith, takeWhile } from 'rxjs/operators';
import { Example } from './example-table/example';
import { names } from './names';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  delay = 2000;
  examples: Observable<Example[]>;
  pending: Observable<boolean>;
  sticky: boolean;

  constructor() {
    this.fetch();
  }

  fetch() {
    let i = 1;
    let milliseconds = 10;
    let maxAmount = 20000;

    // quick and dirty, for illustration purposes only
    this.examples = interval(milliseconds).pipe(
      map(() => names.map(name => ({ id: i++, name }))),
      scan((examples, next) => examples.concat(next)),
      takeWhile(examples => examples.length < maxAmount),
      delay(this.delay),
      startWith([]),
      shareReplay()
    );
    this.pending = this.examples.pipe(
      map(data => data.length === 0)
    );
  }
}
