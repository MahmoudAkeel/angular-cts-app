import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  private toasterSubject = new Subject<string>(); // Holds the toaster message
  toasterMessage$ = this.toasterSubject.asObservable(); // Observable for the message

  constructor() { }

  showToaster(message: string) {
    this.toasterSubject.next(message); 
  }
}
