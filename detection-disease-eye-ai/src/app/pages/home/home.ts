import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UploadButton } from '../../shared/upload-button/upload-button';
import { ResultCard } from '../../shared/result-card/result-card';
import { AiService } from '../../core/services/ai.service';
import { Prediction } from '../../core/models/prediction.model';
import { MatDialog } from '@angular/material/dialog';
import { CameraModal } from '../../shared/camera-modal/camera-modal';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    UploadButton,
    ResultCard
  ],
  providers: [
    AiService
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  // services
  private ai = inject(AiService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef)

  @ViewChild('resultsSection') resultsSection?: ElementRef<HTMLElement>;

  selectedFile?: File | null;
  previewUrl?: string | ArrayBuffer | null;
  prediction: Prediction | null = null;
  loading = false;
  error?: string;
  selectedMode: 'quick' | 'specialist' | null = null;
  MAX_SIZE = 5 * 1024 * 1024;

  onFileSelected(file: File | null, mode: 'quick' | 'specialist') {
    this.error = undefined;
    this.prediction = null;
    this.previewUrl = null;
    this.selectedFile = null;
    this.selectedMode = mode;

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.error = 'Invalid file type';
      return;
    }

    if (file.size > this.MAX_SIZE) {
      this.error = 'Image too large';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
      this.scrollToResults();
    };
    reader.readAsDataURL(file);
  }

  clearSelection() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.prediction = null;
    this.error = undefined;
  }

  async analyze() {
    if (!this.selectedFile) return;

    this.loading = true;

    try {
      const result = await this.ai.analyzeImage( this.selectedFile, this.selectedMode! );
      this.loading = false;
      this.prediction = result;
    } catch (err) {
      console.log(err);
      this.loading = false;
      this.error = 'Analysis failed';
    }
  }

  openCameraModal(mode: 'quick' | 'specialist') {
    this.selectedMode = mode;
    const ref = this.dialog.open(CameraModal, {
      width: '90%',
      disableClose: true
    });

    ref.afterClosed().subscribe((dataUrl: string | null) => {
      if (!dataUrl) return;
      this.setPreviewFromDataUrl(dataUrl);
    });
  }

  setPreviewFromDataUrl(dataUrl: string) {
    this.previewUrl = dataUrl;
    const file = this.dataURLToFile(dataUrl, 'camera.jpg');
    this.selectedFile = file;
    this.cdr.markForCheck();
    this.scrollToResults();
  }

  dataURLToFile(dataUrl: string, filename: string) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8 = new Uint8Array(n);
    while (n--) u8[n] = bstr.charCodeAt(n);
    return new File([u8], filename, { type: mime });
  }

  scrollToResults() {
    setTimeout(() => {
      this.resultsSection?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50);
  }

}