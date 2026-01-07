import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-g-donghua',
  templateUrl: './g-donghua.component.html',
  styleUrls: ['./g-donghua.component.less'],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.8,
        backgroundColor: 'blue'
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ]
})

export class GDonghuaComponent implements OnInit {
  isOpen = true;
  toggle() {
    this.isOpen = !this.isOpen;
  }
  public list = [];

  constructor() { }

  add() {
    this.list = [1, 2, 3, 4, 5, 6]
  }

  ngOnInit() {
    this.list = [1, 2, 3]
  }

}
