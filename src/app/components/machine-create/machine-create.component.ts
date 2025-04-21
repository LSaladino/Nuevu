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

  ngOnInit(): void {
    this.machineFleetCreateForm = new FormGroup({
      id: new FormControl(['', Validators.required]),
      name: new FormControl(['', Validators.required]),
      status: new FormControl([0, Validators.required]),
      performance: new FormControl([0, Validators.required]),

      performanceLog: new FormArray([]), //###############################

      errors: new FormControl(['']),

      errorHistory: new FormArray([]), //###############################

      producedParts: new FormControl([0, Validators.required]),
      production: new FormGroup({
        currentProduct: new FormControl(['', Validators.required]),
        partsInBatch: new FormControl([0, Validators.required]),
        partsCompleted: new FormControl([0, Validators.required]),
        batchStartTime: new FormControl(['', Validators.required])
      }),
      details: new FormGroup({
        manufacturer: new FormControl(['', Validators.required]),
        modelNumber: new FormControl(['', Validators.required]),
        lastMaintenance: new FormControl(['', Validators.required]),
        location: new FormControl(['', Validators.required])
      }),

      maintenanceHistory: new FormArray([]), //###############################

      liveSensors: new FormGroup({
        temperatureC: new FormControl([0, Validators.required]),
        vibrationLevel: new FormControl([0, Validators.required]),
        powerConsumptionKw: new FormControl([0, Validators.required])
      }),
      currentShift: new FormGroup({
        operatorName: new FormControl(['', Validators.required]),
        shift: new FormControl(['', Validators.required])
      })
    });

    this.machineFleetCreateForm.valueChanges.subscribe((value) => {
      this.formData = value;
      console.log('ValueChanges ->', this.formData);
    });

    this.machineFleetCreateForm.statusChanges.subscribe((status) => {
      this.formStatus = status;
      console.log('StatusChanges ->', this.formStatus);
    });

  }




} //###############################
