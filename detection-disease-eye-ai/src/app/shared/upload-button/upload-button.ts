import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upload-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './upload-button.html',
  styleUrl: './upload-button.scss'
})
export class UploadButton {
  @Input() buttonLabel: string = 'Upload Photo';
  @Input() typeButton: 'general-user' | 'medical-professional' = 'general-user';
  @Output() fileSelected = new EventEmitter<File | null>();

  onFile(event: Event) {
    const el = event.target as HTMLInputElement;
    const file = el.files && el.files.length ? el.files[0] : null;
    this.fileSelected.emit(file);
    el.value = '';
  }
}
