import { Injectable } from '@angular/core';
import { Prediction } from '../models/prediction.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private apiUrl = environment.apiUrl;

  async analyzeImage(
    file: File,
    mode: 'quick' | 'specialist'
  ): Promise<Prediction> {

    const formData = new FormData();
    formData.append('file', file);

    const endpoint =
      mode === 'quick'
        ? '/analyze/quick'
        : '/analyze/specialist';

    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: 'POST',
      body: formData
    })

    return response.json();
  }

}
