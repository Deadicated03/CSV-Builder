import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddColumnDialogComponent } from './add-column-dialog';

describe('AddColumnDialog', () => {
  let component: AddColumnDialogComponent;
  let fixture: ComponentFixture<AddColumnDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddColumnDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddColumnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
