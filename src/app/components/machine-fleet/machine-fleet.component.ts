import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';
import { ServiceMachineFleetService } from 'src/app/services/service-machine-fleet.service';


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
  performanceLog: string[] = []; // Define the performanceLog property as an array of strings
  errors: string[] = []; // Define the errors property as an array of strings
  errorHistory: string[] = []; // Define the errorHistory property as an array of strings
  maintenanceHistory: string[] = []; // Define the maintenanceHistory property as an array of strings
  public array_ofMachines$: Observable<any[]> | undefined;


  constructor(private fb: FormBuilder,
    private serviceMachineFleet: ServiceMachineFleetService,
    private toastr: ToastrService,
    private dialogServise: DialogService,

  ) {

    this.machineFleetForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      status: [0, Validators.required],
      performance: [0, Validators.required],

      // performanceLog: this.buildPerformanceLogArray(),
      performanceLog: this.fb.array([]), // Initialize as an empty FormArray

      // errors: this.buildErrorsArray(),
      errors: this.fb.array([]), // Initialize as an empty FormArray

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
    if (this.machineFleetForm.valid) {
      console.log(this.machineFleetForm.value);
      this.onAddMachine();
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
    // this.serviceMachineFleet.getAllMachines().subscribe(
    //   (response) => {
    //     console.log(response);
    //     this.machineFleet = response;
    //     this.toastr.success('Machines fetched successfully');
    //   },
    //   (error) => {
    //     console.error(error);
    //     this.toastr.error('Error fetching machines');
    //   }
    // );

  }


  onSelectMachine(machine: any) {

    this.machineFleetForm.reset();

    // Patch simple fields
    this.machineFleetForm.patchValue({
      id: machine.id,
      name: machine.name,
      status: machine.status,
      performance: machine.performance,
      producedParts: machine.producedParts,
      production: {
        currentProduct: machine.production.currentProduct,
        partsInBatch: machine.production.partsInBatch,
        partsCompleted: machine.production.partsCompleted,
        batchStartTime: machine.production.batchStartTime
      },
      details: {
        manufacturer: machine.details.manufacturer,
        modelNumber: machine.details.modelNumber,
        lastMaintenance: machine.details.lastMaintenance,
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
      this.fb.group({
        timestamp: [log.timestamp, Validators.required],
        performance: [log.performance, Validators.required]
      })
    );

    this.setFormArray('errors', machine.errors, (error) =>
      this.fb.group({
        message: [error.message, Validators.required],
      })
    );



    this.setFormArray('errorHistory', machine.errorHistory, (error) =>
      this.fb.group({
        timestamp: [error.timestamp, Validators.required],
        errorCode: [error.errorCode, Validators.required],
        message: [error.message, Validators.required],
        resolved: [error.resolved, Validators.required]
      })
    );

    this.setFormArray('maintenanceHistory', machine.maintenanceHistory, (history) =>
      this.fb.group({
        date: [history.date, Validators.required],
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

  onAddMachine() {
    if (this.machineFleetForm.valid) {
      this.serviceMachineFleet.createMachine(this.machineFleetForm.value).subscribe(
        (response) => {
          console.log(response);
          this.toastr.success('Machine created successfully');
          this.getAllMachines();
          this.machineFleetForm.reset();
        },
        (error) => {
          console.error(error);
          this.toastr.error('Error creating machine');
        }
      );
    } else {
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
  }

  
  //####################################################################


}