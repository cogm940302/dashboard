
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';

import { LbdChartComponent } from './lbd-chart/lbd-chart.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule
  ],
  declarations: [

    LbdChartComponent

  ],
  exports: [
    LbdChartComponent
  ]
})
export class LbdModule { }
