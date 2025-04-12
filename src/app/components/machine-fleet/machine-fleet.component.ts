import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
      performanceLog: this.fb.array([]),
      errors: this.fb.array([]),
      errorHistory: this.fb.array([]),
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
      maintenanceHistory: this.fb.array([]),
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
    this.serviceMachineFleet.getAllMachines().subscribe(
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
    this.oSelectedMachine = true;
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
      maintenanceHistory: machine.maintenanceHistory,
      liveSensors: {
        temperatureC: machine.liveSensors.temperatureC,
        vibrationLevel: machine.liveSensors.vibrationLevel,
        powerConsumptionKw: machine.liveSensors.powerConsumptionKw
      },
      currentShift: {
        operatorName: machine.currentShift.operatorName,
        shift: machine.currentShift.shift
      }
    })
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
    // this.oSelectedMachine = false;
  }

  onNewMachine() {
    this.machineFleetForm.reset();
    this.oSelectedMachine = true;
  }

}