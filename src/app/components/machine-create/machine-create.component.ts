import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServiceMachineFleetService } from 'src/app/services/service-machine-fleet.service';

@Component({
  selector: 'app-machine-create',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.css']
})
export class MachineCreateComponent implements OnInit {
  formData = {};
  formStatus: string = '';

  machineFleetCreateForm: FormGroup;

  constructor(private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private serviceMachine: ServiceMachineFleetService
  ) { }

  ngOnInit() {
    this.machineFleetCreateForm = new FormGroup({
      id: new FormControl(null, Validators.required),
      name: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/)]),
      status: new FormControl(null, Validators.required),
      performance: new FormControl(null, Validators.required),

      performanceLog: new FormArray([

      ]), //###############################

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
    let GUID = this.generateGUID();
    this.machineFleetCreateForm.patchValue({
      id: GUID
    });
    console.log(this.machineFleetCreateForm.value);

    if (this.machineFleetCreateForm.valid) {
      this.onPostMachine();
    }
    else {
      console.log('Form is invalid');
    }

  }

  onCloseForm() { }

  onResetForm() {
    this.machineFleetCreateForm.reset();
    console.log('Form Reset');
  }

  onDeletePerformanceLog(index: number) {
    const performanceLogs = <FormArray>this.machineFleetCreateForm.get('performanceLog');
    performanceLogs.removeAt(index);
  }

  // onAddPerformanceLog() {
  //   const performanceLogs = new FormGroup({
  //     timestamp: new FormControl(null),
  //     performance: new FormControl(null)
  //   });

  //   (<FormArray>this.machineFleetCreateForm.get('performanceLog')).push(performanceLogs);
  // }


  onAddPerformanceLog(): void {
    // Create a new FormGroup dynamically with 'timestamp' and 'performance' fields
    const performanceLog: FormGroup = this.fb.group({
      timestamp: [this.datePipe.transform(Date(), 'dd/MM/yyyy HH:mm:ss', 'pt')], // Default to current timestamp
      performance: [''] // Default to an empty string
    });

    // Add the new FormGroup to the FormArray
    // this.machineFleetCreateForm.push(performanceLog);
    (<FormArray>this.machineFleetCreateForm.get('performanceLog')).push(performanceLog);

  }

  onAddErrorHistory(): void {

    const errorHistory = new FormGroup({
      timestamp: new FormControl(this.datePipe.transform(Date(), 'dd/MM/yyyy HH:mm:ss', 'pt')),
      errorCode: new FormControl(null),
      message: new FormControl(null),
      resolved: new FormControl(false)
    });

    (<FormArray>this.machineFleetCreateForm.get('errorHistory')).push(errorHistory);


    // another way to do it
    // const errorHistory = this.machineFleetCreateForm.get('errorHistory') as FormArray;
    // const error = new FormGroup({
    //   timestamp: new FormControl(this.datePipe.transform(Date(), 'dd/MM/yyyy HH:mm:ss', 'pt')),
    //   errorCode: new FormControl(null),
    //   message: new FormControl(null),
    //   resolved: new FormControl(false)
    // });
    // errorHistory.push(error);

  }

  onDeleteErrorHistory(index: number) {
    const errorHistory = <FormArray>this.machineFleetCreateForm.get('errorHistory');
    errorHistory.removeAt(index);
  }


  onPostMachine() {
    if (this.machineFleetCreateForm.valid) {
      const formData = JSON.parse(JSON.stringify(this.machineFleetCreateForm.value));

      // Define HTTP headers
      // const httpOptions = {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json',
      //     // 'Autorization':'Bearer ' + localStorage.getItem('token') // Replace with your actual token
      //     'Autorization':'Bearer ' + 'AADDFFKKKLLLL'
      //   })
      // };

      // Make the POST request with headers
      // this.serviceMachineFleet.createMachine(formData, httpOptions).subscribe(
      console.log(formData);
      this.serviceMachine.createNewMachine(formData).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('Machine created successfully');
        },
        error: (error) => {
          console.error(error);
          if (error.status === 0) {
            this.toastr.error('CORS error: Unable to connect to the API');
          } else {
            this.toastr.error('Error creating machine');
          }
        }
      });

    } else {
      console.log(this.machineFleetCreateForm);
      this.toastr.error('Please fill all required fields');
    }

  }

  private generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const random = Math.random() * 16 | 0;
      const value = char === 'x' ? random : (random & 0x3 | 0x8);
      return value.toString(16);
    });
  }










} //###############################
