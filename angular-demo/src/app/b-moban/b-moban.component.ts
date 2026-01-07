import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-b-moban',
  templateUrl: './b-moban.component.html',
  styleUrls: ['./b-moban.component.less']
})
export class BMobanComponent implements OnInit {

  data: string = "我是插值表达式数据"

  dateTime = new Date()

  // 管道数据映射
  sex: string = '2';
  sexMapping: { [k: string]: string } = { '=1': '男', '=2': '女', 'other': '其他' };

  constructor() { }

  ngOnInit() {
  }

}
