import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingResult } from './mapping-result';

describe('MappingResult', () => {
  let component: MappingResult;
  let fixture: ComponentFixture<MappingResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MappingResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MappingResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
