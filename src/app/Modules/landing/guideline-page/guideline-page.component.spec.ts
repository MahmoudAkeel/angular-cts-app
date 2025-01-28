import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidelinePageComponent } from './guideline-page.component';

describe('GuidelinePageComponent', () => {
  let component: GuidelinePageComponent;
  let fixture: ComponentFixture<GuidelinePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidelinePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuidelinePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
