import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiFeatureComponent } from './ui-feature.component';

describe('UiFeatureComponent', () => {
  let component: UiFeatureComponent;
  let fixture: ComponentFixture<UiFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
