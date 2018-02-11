import { Component, OnInit, Input } from '@angular/core';

import { UiService} from '../ui.service'
import { UserService} from '../user.service'

import * as _ from 'lodash';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnInit {
  @Input() user = '';
  allFeeds = [];
  subscribedFeeds = [];

  constructor(private uiService: UiService, private userService: UserService) { }

  async ngOnInit() {
    this.userService.currentUser.subscribe(async (user) => {
      console.log('feeds: settting user to: ', user);
      this.user = user;
      this.subscribedFeeds = await this.uiService.getFeedsForUser(this.user);
    });
    [this.allFeeds, this.subscribedFeeds] = await Promise.all([
        this.uiService.getAllFeeds(),
        this.uiService.getFeedsForUser(this.user)]);
  }

  async subscribe(feed) {
    await this.uiService.subscribe(feed.id, this.user);
    this.subscribedFeeds = await this.uiService.getFeedsForUser(this.user);
  }

  async unsubscribe(feed) {
    await this.uiService.unsubscribe(feed.id, this.user);
    this.subscribedFeeds = await this.uiService.getFeedsForUser(this.user);
  }

  isSubscribed(feed) {
    return _.find(this.subscribedFeeds, ['feedId', feed.id]);
  }
}
