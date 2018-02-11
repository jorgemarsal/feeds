import { Component, OnInit } from '@angular/core';
import { UiService} from '../ui.service'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  feeds = []
  title = ''
  contents = ''
  selectedFeed = ''

  constructor(private uiService: UiService) { }

  async ngOnInit() {
    this.feeds = await this.uiService.getAllFeeds();
    if (this.feeds && this.feeds.length) {
      this.selectedFeed = this.feeds[0].id;
    }
  }

  publish() {
    const article = {
      title: this.title,
      contents: this.contents,
    }
    this.uiService.addArticle(article, this.selectedFeed);
  }

}
