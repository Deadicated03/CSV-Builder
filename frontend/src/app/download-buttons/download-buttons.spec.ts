import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadButtons } from './download-buttons';

describe('DownloadButtons', () => {
  let component: DownloadButtons;
  let fixture: ComponentFixture<DownloadButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadButtons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
