import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';

@Injectable()
export class UiService {

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getAllFeeds(): Promise<any> {
    return this.http
      .get('/api/v1/allfeeds')
      .toPromise()
      .then((res) => {
              return res;
        })
        .catch((err) => {
          this.toastr.error('', `Error loading feed list: ${JSON.stringify(_.get(err,'statusText',''))}`);
        });
      }

  addArticle(article, feed): Promise<any> {
    const params = new HttpParams().set('feed', feed);
    const headers = new HttpHeaders().set('Content-Type','application/json');
    const body = {
      title: article.title,
      contents: article.contents
    };
    return this.http
      .post('/api/v1/', body, { params, headers, responseType: 'text' })
      .toPromise()
      .then((res) => {
              this.toastr.success('', 'Article uploaded correctly.');
        })
        .catch((err) => {
          this.toastr.error('', `Error uplading article: ${JSON.stringify(_.get(err,'statusText',''))}`);
        });
      }

  getArticles(user, begin, end): Promise<any> {
   const params = new HttpParams().set('user', user).set('begin', begin).set('end', end);

    return this.http
      .get('/api/v1/', { params })
      .toPromise()
      .then((res) => {
              return res;
        })
        .catch((err) => {
          this.toastr.error('', `Error loading articles: ${JSON.stringify(_.get(err,'statusText',''))}`);
        });
      }

  getFeedsForUser(user): Promise<any> {
   const params = new HttpParams().set('user', user);

    return this.http
      .get('/api/v1/feeds', { params })
      .toPromise()
      .then((res) => {
              return res;
        })
        .catch((err) => {
          this.toastr.error('', `Error loading user feeds: ${JSON.stringify(_.get(err,'statusText',''))}`);
        });
      }

  subscribe(feed, user): Promise<any> {
    const params = new HttpParams().set('user', user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http
      .post(`/api/v1/feed/${feed}/subscribe`, {}, { params, headers, responseType: 'text' })
      .toPromise()
      .then((res) => {
              this.toastr.success('', 'Subscribed correctly.');
        })
        .catch((err) => {
          this.toastr.error('', `Error subscribing: ${JSON.stringify(_.get(err,'statusText',''))}`);
        });
  
      }


  unsubscribe(feed, user): Promise<any> {
    const params = new HttpParams().set('user', user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http
      .post(`/api/v1/feed/${feed}/unsubscribe`, {}, { params, headers, responseType: 'text' })
      .toPromise()
      .then((res) => {
              this.toastr.success('', 'Unsubscribed correctly.');
        })
        .catch((err) => {
          this.toastr.error('', `Error unsubscribing: ${JSON.stringify(_.get(err,'statusText',''))}`);
        });
      }


}
