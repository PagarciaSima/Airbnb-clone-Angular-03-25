import { Component, EventEmitter, input, Output } from '@angular/core';
import { LocationMapComponent } from "./location-map/location-map.component";

@Component({
  selector: 'app-location-step',
  standalone: true,
  imports: [LocationMapComponent],
  templateUrl: './location-step.component.html',
  styleUrl: './location-step.component.scss'
})
export class LocationStepComponent {

  location = input.required<string>();

  @Output()
  locationChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  stepValidityChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  onLocationChange(location: string) {
    this.locationChange.emit(location);
    this.stepValidityChange.emit(true);
  }
}
