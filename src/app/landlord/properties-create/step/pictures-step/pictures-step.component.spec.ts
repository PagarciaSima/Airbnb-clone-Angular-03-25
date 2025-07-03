import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicturesStepComponent } from './pictures-step.component';

describe('PicturesStepComponent', () => {
  let component: PicturesStepComponent;
  let fixture: ComponentFixture<PicturesStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PicturesStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PicturesStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
