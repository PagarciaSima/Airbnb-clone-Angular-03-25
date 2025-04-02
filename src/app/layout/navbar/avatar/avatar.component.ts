import { NgClass } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [NgClass, FontAwesomeModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {

  imageUrl: InputSignal<string | undefined> = input<string>();
  avatarSize:  InputSignal<"avatar-sm" | "avatar-xl" | undefined> = input<"avatar-sm" | "avatar-xl">();

}
