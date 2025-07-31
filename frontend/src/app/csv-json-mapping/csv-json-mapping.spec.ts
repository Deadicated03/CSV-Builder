import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvJsonMapping } from './csv-json-mapping';

describe('CsvJsonMapping', () => {
  let component: CsvJsonMapping;
  let fixture: ComponentFixture<CsvJsonMapping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvJsonMapping]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvJsonMapping);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
