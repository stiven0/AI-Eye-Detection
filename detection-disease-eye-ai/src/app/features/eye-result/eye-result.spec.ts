import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeResult } from './eye-result';

describe('EyeResult', () => {
  let component: EyeResult;
  let fixture: ComponentFixture<EyeResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EyeResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EyeResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
