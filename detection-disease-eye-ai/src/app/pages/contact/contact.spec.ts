import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Specialist } from './contact';

describe('Specialist', () => {
  let component: Specialist;
  let fixture: ComponentFixture<Specialist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Specialist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Specialist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
