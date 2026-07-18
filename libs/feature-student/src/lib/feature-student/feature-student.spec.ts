import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureStudent } from './feature-student';

describe('FeatureStudent', () => {
  let component: FeatureStudent;
  let fixture: ComponentFixture<FeatureStudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureStudent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureStudent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
