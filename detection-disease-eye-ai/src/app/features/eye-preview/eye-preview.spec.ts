import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyePreview } from './eye-preview';

describe('EyePreview', () => {
  let component: EyePreview;
  let fixture: ComponentFixture<EyePreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EyePreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EyePreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
