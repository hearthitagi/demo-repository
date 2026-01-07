import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  // 子传父@ViewChild()第一步(child是子组件本身，可以模板引用子组件/直接引用；childData是变量名)
  @ViewChild("child") childData;

  fatherData = '父组件数据';
  EventEmitterData: string = '';
  viewChildData: string = '';

  fromSon(data): void {
    this.EventEmitterData = data;
  }
  getSon(): void {
    this.viewChildData = this.childData.viewData;
  }
}
