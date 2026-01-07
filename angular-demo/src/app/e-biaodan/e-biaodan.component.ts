// FormBuilder生成表单第一步
// FormArray动态表单第一步
// 验证表单输入第一步(响应式)，导入
// 响应式表单第二步，引入所使用控件
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
// 自定义验证器第二步
export function ipv4Validator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? null : { forbiddenName: control.value };
  };
}
// 交叉验证
export const identityRevealedValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const name = control.get('name');
  const alterEgo = control.get('alterEgo');

  return name && alterEgo && name.value === alterEgo.value ? { identityRevealed: true } : null;
};


@Component({
  selector: 'app-e-biaodan',
  templateUrl: './e-biaodan.component.html',
  styleUrls: ['./e-biaodan.component.less']
})

export class EBiaodanComponent implements OnInit {
  heroForm = new FormGroup({
    'name': new FormControl(),
    'alterEgo': new FormControl(),
    'power': new FormControl()
  }, { validators: identityRevealedValidator });

  // 响应式表单第三步，新建表单控件
  name = new FormControl("");
  // 修改表单得值
  updateName() {
    this.name.setValue('Nancy');
  }
  // 表单控件组(嵌套组)
  // profileForm = new FormGroup({
  //   firstName: new FormControl(''),
  //   lastName: new FormControl(''),
  //   address: new FormGroup({
  //     street: new FormControl(''),
  //     city: new FormControl(''),
  //     state: new FormControl(''),
  //     zip: new FormControl('')
  //   })
  // })
  // FormBuilder生成表单第三步
  // FormBuilder 服务有三个方法：control()、group() 和 array()。
  // 这些方法都是工厂方法，用于在组件类中分别生成 FormControl、FormGroup 和 FormArray。
  profileForm = this.fb.group({
    // 验证表单输入第二步(响应式)，导入验证器
    firstName: ['', Validators.required],
    // 自定义验证器ipv4Validator，第一步
    lastName: ['', [Validators.required, ipv4Validator(/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/)],

    ],
    address: this.fb.group({
      street: ['',],
      city: [''],
    }),
    // FormArray动态表单第二步
    aliases: this.fb.array([
      this.fb.control('')
    ])
  });
  // 获取表单组的值
  onSubmit() {
    console.log(this.profileForm.value);
  }
  // 修改嵌套表单组中的部分值
  // 也可以用setValue()
  updateProfile() {
    this.profileForm.patchValue({
      firstName: 'Tom',
      address: {
        street: '123 Drew Street'
      }
    })
  }
  // 获取FormArray动态表单的值
  get aliases() {
    return this.profileForm.get('aliases') as FormArray;
  }
  //  FormArray动态表单添加控件
  addAlias() {
    this.aliases.push(this.fb.control(''));
  }


  // 使用FormBuilder来生成表单
  // FormBuilder生成表单第二步，注入FormBuilder服务
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}

