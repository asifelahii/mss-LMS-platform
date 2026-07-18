import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturePayment } from './feature-payment';

describe('FeaturePayment', () => {
  let component: FeaturePayment;
  let fixture: ComponentFixture<FeaturePayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePayment],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
