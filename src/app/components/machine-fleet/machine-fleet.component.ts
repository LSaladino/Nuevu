import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, timestamp } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';
import { ServiceMachineFleetService } from 'src/app/services/service-machine-fleet.service';
import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-machine-fleet',
  templateUrl: './machine-fleet.component.html',
  styleUrls: ['./machine-fleet.component.css']
})
export class MachineFleetComponent implements OnInit {
  machineFleetForm: FormGroup;
  public oSelectedMachine: boolean = false;
  public machineFleet: any[] = [];
  public submitted: boolean = false;
  performanceLog: any[] = []; // Define the performanceLog property as an array of strings
  errors: any[] = []; // Define the errors property as an array of strings
  errorHistory: any[] = []; // Define the errorHistory property as an array of strings
  maintenanceHistory: any[] = []; // Define the maintenanceHistory property as an array of strings
  public array_ofMachines$: Observable<any[]> | undefined;
  public insertStatus: boolean = false;


  constructor(private fb: FormBuilder,
    private serviceMachineFleet: ServiceMachineFleetService,
    private toastr: ToastrService,
    private dialogServise: DialogService,
    private datePipe: DatePipe

  ) {

    this.machineFleetForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      status: [0, Validators.required],
      performance: [0, Validators.required],

      // performanceLog: this.buildPerformanceLogArray(),
      performanceLog: this.fb.array([]), // Initialize as an empty FormArray

      // errors: this.buildErrorsArray(),
      // errors: this.fb.array([]), // Initialize as an empty FormArray
      errors: ['', Validators.required], // Initialize as an empty FormArray

      // errorHistory: this.buildErrorHistoryArray(),
      errorHistory: this.fb.array([]), // Initialize as an empty FormArray

      producedParts: [0, Validators.required],
      production: this.fb.group({
        currentProduct: ['', Validators.required],
        partsInBatch: [0, Validators.required],
        partsCompleted: [0, Validators.required],
        batchStartTime: ['', Validators.required]
      }),
      details: this.fb.group({
        manufacturer: ['', Validators.required],
        modelNumber: ['', Validators.required],
        lastMaintenance: ['', Validators.required],
        location: ['', Validators.required]
      }),

      // maintenanceHistory: this.buildMaintenanceHistoryArray(),
      maintenanceHistory: this.fb.array([]), // Initialize as an empty FormArray

      liveSensors: this.fb.group({
        temperatureC: [0, Validators.required],
        vibrationLevel: [0, Validators.required],
        powerConsumptionKw: [0, Validators.required]
      }),
      currentShift: this.fb.group({
        operatorName: ['', Validators.required],
        shift: ['', Validators.required]
      })
    });
  }


  ngOnInit(): void {
    this.getAllMachines();
    this.machineFleetForm.reset();
  }

  onSubmit(): void {
    this.submitted = true;

    if (!this.insertStatus) {
      if (this.machineFleetForm.valid) {
        this.onUpdateMachine(this.machineFleetForm.value);
      }
    }
    else {
      let GUID = this.generateGUID();
      this.machineFleetForm.patchValue({
        id: GUID
      });
      if (this.machineFleetForm.valid) {
        this.onPostMachine();
      }
    }

  }

  getAllMachines() {
    this.array_ofMachines$ = this.serviceMachineFleet.getAllMachines();
    this.array_ofMachines$.subscribe(
      (response) => {
        console.log(response);
        this.machineFleet = response;
        this.toastr.success('Machines fetched successfully');
      },
      (error) => {
        console.error(error);
        this.toastr.error('Error fetching machines');
      }
    );

  }


  onSelectMachine(machine: any) {
    this.insertStatus = false;
    this.oSelectedMachine = true;
    this.machineFleetForm.reset();

    // Patch simple fields
    this.machineFleetForm.patchValue({
      id: machine.id,
      name: machine.name,
      status: machine.status,
      performance: machine.performance,
      producedParts: machine.producedParts,
      errors: machine.errors,
      production: {
        currentProduct: machine.production.currentProduct,
        partsInBatch: machine.production.partsInBatch,
        partsCompleted: machine.production.partsCompleted,
        batchStartTime: this.datePipe.transform(machine.production.batchStartTime, 'yyyy-MM-ddTHH:mm', 'en')
      },
      details: {
        manufacturer: machine.details.manufacturer,
        modelNumber: machine.details.modelNumber,
        lastMaintenance: this.datePipe.transform(machine.details.lastMaintenance, 'yyyy-MM-dd', 'en'),
        location: machine.details.location
      },
      liveSensors: {
        temperatureC: machine.liveSensors.temperatureC,
        vibrationLevel: machine.liveSensors.vibrationLevel,
        powerConsumptionKw: machine.liveSensors.powerConsumptionKw
      },
      currentShift: {
        operatorName: machine.currentShift.operatorName,
        shift: machine.currentShift.shift
      }
    });

    // Patch FormArray fields
    this.setFormArray('performanceLog', machine.performanceLog, (log) =>
      // Use datePipe to format the timestamp
      this.fb.group({
        timestamp: [
          this.datePipe.transform(log.timestamp, 'yyyy-MM-ddTHH:mm', 'en'), // Format the date
          Validators.required
        ],
        performance: [log.performance, Validators.required]
      })
    );

    // this.setFormArray('errors', machine.errors, (error) =>
    //   this.fb.group({
    //     errors: [error.message, Validators.required],
    //   })
    // );



    this.setFormArray('errorHistory', machine.errorHistory, (error) =>
      this.fb.group({
        timestamp: [this.datePipe.transform(error.timestamp, 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
        errorCode: [error.errorCode, Validators.required],
        message: [error.message, Validators.required],
        resolved: [error.resolved, Validators.required]
      })
    );

    this.setFormArray('maintenanceHistory', machine.maintenanceHistory, (history) =>
      this.fb.group({
        date: [this.datePipe.transform(history.date, 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
        details: [history.details, Validators.required]
      })
    );
  }

  // Helper function to populate FormArray
  private setFormArray(arrayName: string, items: any[], createGroupFn: (item: any) => FormGroup) {
    const formArray = this.machineFleetForm.get(arrayName) as FormArray;
    formArray.clear(); // Clear existing items
    items.forEach((item) => formArray.push(createGroupFn(item))); // Add new items
  }

  private generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const random = Math.random() * 16 | 0;
      const value = char === 'x' ? random : (random & 0x3 | 0x8);
      return value.toString(16);
    });
  }


  onDeleteMachine(machine: any) {
    this.dialogServise.confirmDialog({
      title: 'Confirmation',
      message: 'Are you sure you want to delete this machine? GUID: ' + machine.id,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe((result) => {
      if (result) {
        this.serviceMachineFleet.deleteMachine(machine.id).subscribe(
          (response) => {
            console.log(response);
            this.toastr.success('Machine deleted successfully');
            this.getAllMachines();
            this.onCloseForm();
          },
          (error) => {
            console.error(error);
            this.toastr.error('Error deleting machine');
          }
        );
      }
    });
  }

  onUpdateMachine(machine: any) {
    this.oSelectedMachine = true;
    if (this.machineFleetForm.valid) {
      this.serviceMachineFleet.updateMachine(machine).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('Machine updated successfully');
          this.getAllMachines();
          this.machineFleetForm.reset();
          this.oSelectedMachine = false;
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Error updating machine');
        }
      })
    }
  }

  onPostMachine() {
    if (this.machineFleetForm.valid) {
      const formData = JSON.stringify(this.machineFleetForm.value);
  
      // Define HTTP headers
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // 'Autorization':'Bearer ' + localStorage.getItem('token') // Replace with your actual token
          'Autorization':'Bearer ' + 'AADDFFKKKLLLL'
        })
      };
  
      // Make the POST request with headers
      this.serviceMachineFleet.createMachine(formData, httpOptions).subscribe(
        (response) => {
          console.log(response);
          this.toastr.success('Machine created successfully');
          this.getAllMachines();
          this.machineFleetForm.reset();
        },
        (error) => {
          console.error(error);
          if (error.status === 0) {
            this.toastr.error('CORS error: Unable to connect to the API');
          } else {
            this.toastr.error('Error creating machine');
          }
        }
      );
    } else {
      console.log(this.machineFleetForm);
      this.toastr.error('Please fill all required fields');
    }

  }

  onCloseForm() {
    this.onResetForm();
    this.oSelectedMachine = false;
  }

  onResetForm() {
    this.machineFleetForm.reset();
    this.submitted = false;
  }

  onNewMachine() {
    this.machineFleetForm.reset();
    this.oSelectedMachine = true;
    this.insertStatus = true;

    this.onAddPerformanceLog();
    // this.onAddError();
    this.onAddErrorHistory();
    this.onAddMaintenanceHistory();
  }

  onAddPerformanceLog() {
    const performanceLogArray = this.machineFleetForm.get('performanceLog') as FormArray;

    const newLog = new FormGroup({
      timestamp: new FormControl(''),
      performance: new FormControl(0),
    });

    performanceLogArray.push(newLog);
  }

  // onAddError() {
  //   const errorsArray = this.machineFleetForm.get('errors') as FormArray;
  //   const newError = new FormGroup({
  //     errors: new FormControl(''),
  //   });
  //   errorsArray.push(newError);
  // }

  onAddErrorHistory() {
    const errorHistoryArray = this.machineFleetForm.get('errorHistory') as FormArray;
    const newError = new FormGroup({
      timestamp: new FormControl(''),
      errorCode: new FormControl(''),
      message: new FormControl(''),
      resolved: new FormControl(false)
    });
    errorHistoryArray.push(newError);
  }

  onAddMaintenanceHistory() {
    const maintenanceHistoryArray = this.machineFleetForm.get('maintenanceHistory') as FormArray;
    const newMaintenance = new FormGroup({
      date: new FormControl(''),
      details: new FormControl('')
    });
    maintenanceHistoryArray.push(newMaintenance);
  }

  //####################################################################


}