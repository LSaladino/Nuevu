import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-machine-create',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.css']
})
export class MachineCreateComponent implements OnInit {
  formData = {};
  formStatus: string = '';

  machineFleetCreateForm: FormGroup;

  ngOnInit()  {
    this.machineFleetCreateForm = new FormGroup({
      id: new FormControl(null, Validators.required),
      name: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/)]),
      status: new FormControl(null, Validators.required),
      performance: new FormControl(null, Validators.required),

      performanceLog: new FormArray([]), //###############################

      errors: new FormControl(['']),

      errorHistory: new FormArray([]), //###############################

      producedParts: new FormControl(null, Validators.required),
      production: new FormGroup({
        currentProduct: new FormControl(null, Validators.required),
        partsInBatch: new FormControl(null, Validators.required),
        partsCompleted: new FormControl(null, Validators.required),
        batchStartTime: new FormControl(null, Validators.required)
      }),
      details: new FormGroup({
        manufacturer: new FormControl(null, Validators.required),
        modelNumber: new FormControl(null, Validators.required),
        lastMaintenance: new FormControl(null, Validators.required),
        location: new FormControl(null, Validators.required)
      }),

      maintenanceHistory: new FormArray([]), //###############################

      liveSensors: new FormGroup({
        temperatureC: new FormControl(null, Validators.required),
        vibrationLevel: new FormControl(null, Validators.required),
        powerConsumptionKw: new FormControl(null, Validators.required)
      }),
      currentShift: new FormGroup({
        operatorName: new FormControl(null, Validators.required),
        shift: new FormControl(null, Validators.required)
      })
    });

    // this.machineFleetCreateForm.valueChanges.subscribe((value) => {
    //   this.formData = value;
    //   console.log('ValueChanges ->', this.formData);
    // });

    // this.machineFleetCreateForm.statusChanges.subscribe((status) => {
    //   this.formStatus = status;
    //   console.log('StatusChanges ->', this.formStatus);
    // });

  }

  onSubmit() {
    console.log('Form Submitted', this.machineFleetCreateForm.value);
    if (this.machineFleetCreateForm.valid) {
      console.log('Form Submitted', this.machineFleetCreateForm.value);
    } else {
      console.log('Form is invalid');
    }

  }

  onCloseForm() {}

  onResetForm() {
    this.machineFleetCreateForm.reset();
    console.log('Form Reset');
  }













} //###############################
