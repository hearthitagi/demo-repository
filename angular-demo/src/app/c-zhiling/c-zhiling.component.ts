import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-c-zhiling',
  templateUrl: './c-zhiling.component.html',
  styleUrls: ['./c-zhiling.component.less']
})
export class CZhilingComponent implements OnInit {

  // 指令
  isActive: boolean = true;
  arrayList: number[] = [1, 2, 3];
  htmltags: string = "div";
  hero: String = 'lei';

  // 属性型指令
  current: boolean = true;
  currentClasses: boolean = false;
  cssObj: object = {
    'saveable': true, //如果值为true则会添加上这个类
    'modified': true,
    'special': false //如果值为fasle则会移除这个类
  };
  isSpecial: number = 15;
  expression: object = {
    'font-style': 'italic',
    'font-weight': 'bold',
    'font-size': '24px'
  }
  value3: string = ''
  constructor() { }

  ngOnInit() {
  }

}
