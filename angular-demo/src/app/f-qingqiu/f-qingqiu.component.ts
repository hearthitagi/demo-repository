import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
// const params = new HttpParams().set("_page", "1").set("_limit", "10");
// const params = new HttpParams({fromString: "_page=1&_limit=10"});
const params = new HttpParams({ fromObject: { _page: "1", _limit: "10" } });
const headers = new HttpHeaders().set("token", "iloveangular")
  .set(
    "Content-type",
    "application/json; charset=UTF-8"
  );
@Component({
  selector: 'app-f-qingqiu',
  templateUrl: './f-qingqiu.component.html',
  styleUrls: ['./f-qingqiu.component.less']
})
export class FQingqiuComponent implements OnInit {
  todos$: Observable<Todo[]>;
  // 请求第二步，注入
  constructor(private http: HttpClient) { }
  // post请求
  createNewTodo() {
    this.http
      .post(
        "https://jsonplaceholder.typicode.com/todos",
        {
          userId: 1,
          title: "learn ionic 4",
          completed: false
        }, { headers })
      .subscribe(
        val => { console.log("Post call successful value returned in body", val); },
        error => { console.log("Post call in error", error); },
      );
  }

  ngOnInit() {
    // get请求
    // this.http.get("http://59.110.124.95:3000/getTopicList")
    //   .subscribe(res => {
    //     console.dir("Response: " + res);
    //   });
    // this.todos$ = this.http
    //   .get<Todo[]>("https://jsonplaceholder.typicode.com/todos", { headers, params })
  }

}



