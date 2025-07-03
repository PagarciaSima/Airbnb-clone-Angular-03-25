import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NewListingPicture } from '../../../model/picture.model';

@Component({
  selector: 'app-pictures-step',
  standalone: true,
  imports: [FontAwesomeModule, InputTextModule, ButtonModule],
  templateUrl: './pictures-step.component.html',
  styleUrl: './pictures-step.component.scss'
})
export class PicturesStepComponent {

  pictures: InputSignal<NewListingPicture[]> = input.required<Array<NewListingPicture>>();

  @Output()
  picturesChange = new EventEmitter<Array<NewListingPicture>>();

  @Output()
  stepValidityChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  extractFileFromTarget(target: EventTarget | null) {
    const htmlInputTarget: HTMLInputElement = target as HTMLInputElement;
    if (target === null || htmlInputTarget.files === null) {
      return null;
    }
    return htmlInputTarget.files;
  }

  onUploadNewPicture(target: EventTarget | null) {
    const picturesFileList: FileList | null = this.extractFileFromTarget(target);
    if (picturesFileList != null) {
      for (let i = 0; i < picturesFileList.length; i++) {
        const picture: File | null = picturesFileList.item(i);
        if (picture !== null) {
          const displayPicture: NewListingPicture = {
            file: picture,
            urlDisplay: URL.createObjectURL(picture),
          }
          this.pictures().push(displayPicture);
        }
      }
    }
    this.picturesChange.emit(this.pictures());
    this.validatePictures();
  }

  validatePictures(): void {
    if (this.pictures().length >= 5) {
      this.stepValidityChange.emit(true);
    } else {
      this.stepValidityChange.emit(false);
    }
  }

  onTrashPicture(pictureToDelete: NewListingPicture) {
    const indexToDelete = this.pictures().findIndex(picture => picture.file.name === pictureToDelete.file.name);
    this.pictures().splice(indexToDelete, 1);
    this.validatePictures();
  }

}
