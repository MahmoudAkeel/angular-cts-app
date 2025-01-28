import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BamPageComponent } from './bam-page.component';

describe('BamPageComponent', () => {
  let component: BamPageComponent;
  let fixture: ComponentFixture<BamPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BamPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BamPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
