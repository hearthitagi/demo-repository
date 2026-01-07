import { Component, OnInit, ViewEncapsulation, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-a-zujian',
  templateUrl: './a-zujian.component.html',
  styleUrls: ['./a-zujian.component.less'],
  // 样式封装(组件样式的控制范围)
  // ShadowDom 不进不出、Emulated 只进不出、None 能进能出
  encapsulation: ViewEncapsulation.None,

})
// 组件生命周期
/*
ngOnChanges:当component/directive 的 @Input/@Output 绑定的值发生变化的时候会触发
ngOnInit:在第一个 ngOnChanges 之后触发，只执行一次。这个函数用来初始化页面内容
ngDoCheck(影响性能):1、只要有任何变化检测（比如click handlers, http requests, route changes…）都会执行 ngDoCheck；2、状态发生变化，Angular 自己又不能捕获这个变化会触发 ngDoCheck（https://limeii.github.io/2019/06/angular-ngdocheck-onpush-strategy/）
ngAfterContentInit:页面有用 ng-content 进行组件内容投射，在初始化的时候会执行一次这个函数
ngAfterContentChecked:在每次检查投射内容的时候执行，ngDoCheck 调用之后都会触发这个函数
ngAfterViewInit:component 的页面或者是它的子页面初始化的时候会执行一次这个函数
ngAfterViewChecked:在每次检查 compoent 页面或者它的子页面的时候执行，ngDoCheck 调用之后都会触发这个函数
ngOnDestroy:在 commponet 被销毁之前执行
*/
// 组件交互(4种)(父传子@Input、子传父EventEmitter、子传父模板引用、子传父@ViewChild() )
// 插槽


export class AZujianComponent implements OnInit {
  // 父传子@Input第一步
  @Input() name: string;//子组件定义接受数据的变量
  // 子传父EventEmitter第一步
  @Output() toFather = new EventEmitter();//创建自定义事件对象

  data: string = "子组件数据"
  mobanData: string = "模板引用子组件数据"
  viewData: string = "ViewChild子组件数据"

  someToFather() {
    this.toFather.emit(this.data);//触发自定义事件,并传递一些参数
  }
  constructor() { }

  ngOnInit() {
  }

}
