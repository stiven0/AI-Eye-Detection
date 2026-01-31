import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-camera-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './camera-modal.html',
  styleUrls: ['./camera-modal.scss']
})
export class CameraModal implements OnDestroy {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay') overlayRef!: ElementRef<HTMLDivElement>;
  stream?: MediaStream;
  cameraReady = false;
  isLoading = false;

  constructor(private dialogRef: MatDialogRef<CameraModal>) {}

  async ngAfterViewInit() {
    // no auto-start here to give control from template / init
    await this.startCamera();
  }

  async startCamera() {
    if (this.stream) return;
    this.isLoading = true;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      const video = this.videoRef.nativeElement;
      video.srcObject = this.stream;
      // try to play and wait
      await video.play();
      // now video should be rendering frames
      this.cameraReady = true;
    } catch (err) {
      console.error('Camera start failed', err);
      this.cameraReady = false;
    } finally {
      this.isLoading = false;
    }
  }

  // captura y devuelve dataURL al Home
  // capture() {
  //   const video = this.videoRef?.nativeElement;
  //   if (!video || !this.cameraReady) return;

  //   const doCapture = () => {
  //     // create canvas with video natural size
  //     const canvas = document.createElement('canvas');
  //     canvas.width = video.videoWidth || 640;
  //     canvas.height = video.videoHeight || 480;
  //     const ctx = canvas.getContext('2d');
  //     if (!ctx) {
  //       this.dialogRef.close(null);
  //       return;
  //     }
  //     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  //     // synchronous dataURL (easy to pass between components)
  //     const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

  //     // close modal returning the data url
  //     this.dialogRef.close(dataUrl);

  //     // stop camera after small delay to ensure UI updates
  //     setTimeout(() => this.stopCamera(), 100);
  //   };

  //   // if requestVideoFrameCallback available, use it
  //   const videoAny = video as any;
  //   if ('requestVideoFrameCallback' in videoAny) {
  //     videoAny.requestVideoFrameCallback(() => doCapture());
  //   } else {
  //     // fallback small delay to ensure a frame is present
  //     setTimeout(doCapture, 60);
  //   }
  // }

  capture() {
    const video = this.videoRef.nativeElement;
    const overlay = this.overlayRef.nativeElement;

    if (!video.videoWidth) return;

    // tamaños en pantalla
    const videoRect = video.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();

    // centro del círculo relativo al video
    const radius = overlayRect.width / 2;
    const centerX = (overlayRect.left - videoRect.left) + radius;
    const centerY = (overlayRect.top - videoRect.top) + radius;

    // escala DOM → resolución real video
    const scaleX = video.videoWidth / videoRect.width;
    const scaleY = video.videoHeight / videoRect.height;

    const realCenterX = centerX * scaleX;
    const realCenterY = centerY * scaleY;
    const realRadius = radius * ((scaleX + scaleY) / 2);

    // canvas origen (frame completo)
    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = video.videoWidth;
    fullCanvas.height = video.videoHeight;

    const fullCtx = fullCanvas.getContext('2d');
    fullCtx?.drawImage(video, 0, 0);

    // canvas destino (solo círculo)
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = realRadius * 2;
    cropCanvas.height = realRadius * 2;

    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    // máscara circular
    cropCtx.beginPath();
    cropCtx.arc(realRadius, realRadius, realRadius, 0, Math.PI * 2);
    cropCtx.closePath();
    cropCtx.clip();

    // dibujar solo la zona circular
    cropCtx.drawImage(
      fullCanvas,
      realCenterX - realRadius,
      realCenterY - realRadius,
      realRadius * 2,
      realRadius * 2,
      0,
      0,
      realRadius * 2,
      realRadius * 2
    );

    // exportar
    const dataUrl = cropCanvas.toDataURL('image/jpeg', 0.95);

    this.emitAndClose(dataUrl);
  }

  emitAndClose(dataUrl: string) {
    this.stopCamera();
    this.dialogRef.close(dataUrl);
  }

  cancel() {
    this.dialogRef.close(null);
    this.stopCamera();
  }

  stopCamera() {
    try {
      this.stream?.getTracks().forEach(t => t.stop());
    } catch {}
    this.stream = undefined;
    this.cameraReady = false;
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}
