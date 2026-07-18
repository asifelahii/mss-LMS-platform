import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureLearning } from './feature-learning';

describe('FeatureLearning', () => {
  let component: FeatureLearning;
  let fixture: ComponentFixture<FeatureLearning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureLearning],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureLearning);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
