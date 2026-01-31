import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Prediction } from '../../core/models/prediction.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule,
    MatProgressBarModule
  ],
  templateUrl: './result-card.html',
  styleUrl: './result-card.scss'
})
export class ResultCard {
  @Input() prediction?: Prediction | null;
  predictionResult?: any;

  get emoji() {
    const label = this.prediction?.result.label;

    if (!label) return '❓';

    this.predictionResult = this.prediction?.result.confidence;
    // this.predictionResult = this.prediction?.[this.prediction.index][this.prediction.label];

    if (label === 'healthy') return '🟢';
    if (label === 'conjunctivitis') return '⚠️';
    if (label === 'cellulitis') return '🔴';
    if (label === 'stye') return '🟠';
    if (label === 'amd') return '⚠️';
    if (label === 'cataract') return '⚠️';
    if (label === 'diabetic-retinopathy') return '⚠️';
    if (label === 'normal') return '🟢';
    if (label === 'retinal_detachment') return '⚠️';

    return 'ℹ️';
  }

  get breakdown() {
    if (!this.prediction?.result.predictions) return [];

    return this.prediction.result.predictions
      .map((obj: any) => {
        const key = Object.keys(obj)[0];
        return { label: key, value: obj[key] };
      })
      .sort((a: any, b: any) => b.value - a.value); 
  }

}
