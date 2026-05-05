import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTag } from './edit-tag';

describe('EditTag', () => {
  let component: EditTag;
  let fixture: ComponentFixture<EditTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTag],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTag);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
