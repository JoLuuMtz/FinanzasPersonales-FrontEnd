import { Component, Input } from '@angular/core';
import { PrimeNgModule } from '../../../shared/PrimeNg/primg-ng.module';

@Component({
  selector: 'spend-income-form',
  imports: [PrimeNgModule],
  templateUrl: './spend-income-form.component.html',

})
export class SpendIncomeFormComponent {

  @Input()
  public visible: boolean = false;


  // TODO: CREAR EL FOMULARIO PARA GESTIONAR LOS INGRESOS Y LOS GASTOS DEL USUARIOS

  //TODO: Implementar la toma de datos en el servicio de del los tipos de ingresos y gastos

}

