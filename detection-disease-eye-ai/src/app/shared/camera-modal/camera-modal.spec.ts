import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraModal } from './camera-modal';

describe('CameraModal', () => {
  let component: CameraModal;
  let fixture: ComponentFixture<CameraModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
