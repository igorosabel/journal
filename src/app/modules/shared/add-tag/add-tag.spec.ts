import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTag } from './add-tag';

describe('AddTag', () => {
  let component: AddTag;
  let fixture: ComponentFixture<AddTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTag],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTag);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
