import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineCreateComponent } from './machine-create.component';

describe('MachineCreateComponent', () => {
  let component: MachineCreateComponent;
  let fixture: ComponentFixture<MachineCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineCreateComponent]
    });
    fixture = TestBed.createComponent(MachineCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
