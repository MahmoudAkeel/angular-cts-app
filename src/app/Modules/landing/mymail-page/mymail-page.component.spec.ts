import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MymailPageComponent } from './mymail-page.component';

describe('MymailPageComponent', () => {
  let component: MymailPageComponent;
  let fixture: ComponentFixture<MymailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MymailPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MymailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
