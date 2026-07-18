import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureTeacher } from './feature-teacher';

describe('FeatureTeacher', () => {
  let component: FeatureTeacher;
  let fixture: ComponentFixture<FeatureTeacher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureTeacher],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureTeacher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
