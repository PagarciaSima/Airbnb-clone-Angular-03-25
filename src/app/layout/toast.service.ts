import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  INIT_STATE: string = "INIT";
  private send$: BehaviorSubject<Message> = new BehaviorSubject<Message>({ summary: this.INIT_STATE });
  senSub: Observable<Message> = this.send$.asObservable();

  constructor() { }

  public send(message: Message) {
    this.send$.next(message);
  }
}
