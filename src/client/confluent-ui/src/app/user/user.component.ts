import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userinput = '1';
  user = '1';
  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  setUser() {
    console.log('changing user');
    this.userService.changeUser(this.userinput);
    this.user = this.userinput;
  }

}
