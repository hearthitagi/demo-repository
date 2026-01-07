import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// 双向数据绑定,(模板驱动表单)(第一个)
// 响应式表单第一步，导入
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
// 路由第一步,导入
import { Routes, RouterModule } from '@angular/router';
// 请求第一步,导入
import { HttpClientModule } from '@angular/common/http';

// 动画
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// 组件引入
import { AppComponent } from './app.component';
import { AZujianComponent } from './a-zujian/a-zujian.component';
import { BMobanComponent } from './b-moban/b-moban.component';
import { CZhilingComponent } from './c-zhiling/c-zhiling.component';
import { DLuyouComponent } from './d-luyou/d-luyou.component';
import { EBiaodanComponent } from './e-biaodan/e-biaodan.component';
import { FQingqiuComponent } from './f-qingqiu/f-qingqiu.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GDonghuaComponent } from './g-donghua/g-donghua.component';



// 路由第二步,定义
const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'biaodan', component: EBiaodanComponent },
  { path: 'index', component: AppComponent },
  { path: '**', component: NotFoundComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    AZujianComponent,
    BMobanComponent,
    CZhilingComponent,
    DLuyouComponent,
    EBiaodanComponent,
    FQingqiuComponent,
    GDonghuaComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    // 双向数据绑定
    FormsModule,
    // 路由第一步导入
    RouterModule.forRoot(routes),
    // 响应式表单第一步，导入
    ReactiveFormsModule,
    // 请求第一步,导入
    HttpClientModule,
    //模块加在app.module中就能用
    BrowserAnimationsModule,
    // 动画
    BrowserAnimationsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
