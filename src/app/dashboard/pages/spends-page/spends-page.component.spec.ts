import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendsPageComponent } from './spends-page.component';

describe('SpendsPageComponent', () => {
  let component: SpendsPageComponent;
  let fixture: ComponentFixture<SpendsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpendsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
