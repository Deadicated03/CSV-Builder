import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCodeTemplate } from './no-code-template';

describe('NoCodeTemplate', () => {
  let component: NoCodeTemplate;
  let fixture: ComponentFixture<NoCodeTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoCodeTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoCodeTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
