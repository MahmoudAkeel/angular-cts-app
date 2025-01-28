import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationPageComponent } from './delegation-page.component';

describe('DelegationPageComponent', () => {
  let component: DelegationPageComponent;
  let fixture: ComponentFixture<DelegationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelegationPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DelegationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
