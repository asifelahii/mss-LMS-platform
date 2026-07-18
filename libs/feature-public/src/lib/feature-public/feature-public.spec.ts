import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturePublic } from './feature-public';

describe('FeaturePublic', () => {
  let component: FeaturePublic;
  let fixture: ComponentFixture<FeaturePublic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePublic],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePublic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
