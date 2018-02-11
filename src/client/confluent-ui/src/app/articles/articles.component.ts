import { Component, OnInit, Input } from '@angular/core';

import { UiService } from '../ui.service';
import { UserService } from "../user.service";

import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  begin;
  end;

  user = '';
  articles = []

  
  constructor(private uiService: UiService, private userService: UserService) { }

  async ngOnInit() {
    this.setDates();
    this.userService.currentUser.subscribe(async (user) => {
      console.log('articles: settting user to: ', user);
      this.user = user;
      await this.getArticles()
    });
    await this.getArticles()
  }

  async getArticles() {
      const beginDate = new Date();
      beginDate.setDate(this.begin.day);
      beginDate.setMonth(this.begin.month);
      beginDate.setFullYear(this.begin.year);
      const endDate = new Date();
      endDate.setDate(this.end.day);
      endDate.setMonth(this.end.month);
      endDate.setFullYear(this.end.year);
      this.articles = await this.uiService.getArticles(this.user, beginDate.toISOString(), endDate.toISOString());
  }

  setDates() {
    const now = new Date();
    this.end = { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() };
    const oneDayAgo = new Date();
    oneDayAgo.setDate(now.getDate() - 1);
    this.begin = { day: oneDayAgo.getDate(), month: oneDayAgo.getMonth(), year: oneDayAgo.getFullYear() };
  }

  async refresh() {
    await this.getArticles()
  }

}
