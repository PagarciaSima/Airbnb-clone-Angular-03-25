import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-info-step-control',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './info-step-control.component.html',
  styleUrl: './info-step-control.component.scss'
})
export class InfoStepControlComponent {

  title : InputSignal<string> = input.required<string>();
  value: InputSignal<number> = input.required<number>();
  minValue: InputSignal<number> = input<number>(0);

  @Output()
  valueChange: EventEmitter<number> = new EventEmitter<number>();

  separator: InputSignal<boolean> = input<boolean>(true);

  onIncrement(): void {
    this.valueChange.emit(this.value() + 1);
  }

  onDecrement(): void {
    this.valueChange.emit(this.value() - 1);
  }
}
