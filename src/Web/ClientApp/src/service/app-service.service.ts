import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

constructor() { }
private static isIndexSubject = new BehaviorSubject<boolean>(true);
isIndex$ = AppService.isIndexSubject.asObservable();

toggle( isHide:boolean): void {
  AppService.isIndexSubject.next(isHide);
  this.updateDOM();
}

private updateDOM(): void {
  const frontpageElement = document.querySelector('.frontpage');
  if (frontpageElement) {
    frontpageElement.setAttribute('style', AppService.getValue() ? 'display:block;' : 'display:none;');
  }
}

static getValue(): boolean {
  let v = AppService.isIndexSubject.value;
  return v;


}

}
