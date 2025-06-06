import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { State } from '../core/model/state.model';
import { CreatedListing, NewListing } from './model/listing.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LandlordListingService {

  private create$: WritableSignal<State<CreatedListing>>
    = signal(State.Builder<CreatedListing>().forInit());
  createSig: Signal<any> = computed(() => this.create$);

  constructor(private http: HttpClient) { }

  create(newListing: NewListing): void {
    const formData = new FormData();
    for (let i = 0; i < newListing.picture.length; i++) {
      formData.append("picture-" + i, newListing.picture[i].file);
    }
    const clone = structuredClone(newListing);
    clone.picture = [];
    formData.append("dto", JSON.stringify(clone));

    this.http.post<CreatedListing>(`${environment.API_URL}/landlord-listing/create`
      , formData
    ).subscribe({
      next: (listing: CreatedListing) => {
        this.create$.set(State.Builder<CreatedListing>().forSuccess(listing));
      },
      error: (err) => {
        this.create$.set(State.Builder<CreatedListing>().forError(err));
      }
    });
  }

  resetListingCreation(): void {
    this.create$.set(State.Builder<CreatedListing>().forInit())
  }
  
}
