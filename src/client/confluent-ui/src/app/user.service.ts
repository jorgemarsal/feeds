import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService {
  private userSource = new BehaviorSubject<string>("1");
  currentUser = this.userSource.asObservable();
  constructor() { }
  changeUser(user: string) {
    this.userSource.next(user)
  }
}
