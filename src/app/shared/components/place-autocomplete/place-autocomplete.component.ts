import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, Output, EventEmitter, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GoogleMap } from '@angular/google-maps';
import { Loader } from '@googlemaps/js-api-loader';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-place-autocomplete',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, CommonModule],
  templateUrl: './place-autocomplete.component.html',
  styleUrls: ['./place-autocomplete.component.css']
})
export class PlaceAutocompleteComponent implements AfterViewInit, OnDestroy {
  @ViewChild('inputField') inputField!: ElementRef;
  @Input() placeholder = 'Nombre de tu local';
  @Output() placeSelected = new EventEmitter<any>();

  private apiKey = environment.googleMapsApiKey;

  private autocomplete: google.maps.places.Autocomplete | undefined;
  private sessionToken: google.maps.places.AutocompleteSessionToken | undefined;
  private static loaderInstance: Loader | undefined; // Static variable for the Loader instance

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Only load Google Maps if we're in the browser
      this.loadGoogleMapsApi();
    }
  }

  private loadGoogleMapsApi() {
    // Create the Loader only if it doesn't already exist
    if (!PlaceAutocompleteComponent.loaderInstance) {
      PlaceAutocompleteComponent.loaderInstance = new Loader({
        apiKey: this.apiKey,
        version: "weekly",
        libraries: ["places"]
      });
    }

    // Use the same loader instance to load the API
    PlaceAutocompleteComponent.loaderInstance.load().then((google) => {
      this.initAutocomplete(google);
    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
    });
  }

  private initAutocomplete(api: typeof google) {
    if (this.inputField && api.maps.places) {
      this.sessionToken = new google.maps.places.AutocompleteSessionToken(); // Generate a session token
      
      // Set up autocomplete with fields and restrictions
      this.autocomplete = new api.maps.places.Autocomplete(this.inputField.nativeElement, {
        types: ['establishment'],
        componentRestrictions: { country: 'pe' },
        fields: ['place_id', 'name', 'geometry', 'formatted_address', 'rating', 'photos', 'vicinity']
      });

      // Add event listener for place selection
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete?.getPlace();
        if (place) {
          console.log("Google place", place);
          this.handlePlaceSelection(place);
        }
      });
    }
  }

  private handlePlaceSelection(place: google.maps.places.PlaceResult) {
    const selectedPlace = {
      name: place.name,
      location: {
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
      },
      rating: place.rating,
      place_id: place.place_id,
      address: place.vicinity || place.formatted_address,
      photos: place.photos ? place.photos.slice(0, 3).map(photo => photo.getUrl({ maxWidth: 400 })) : []
    };

    // Emit only the necessary data
    this.placeSelected.emit(selectedPlace);

    // Generate a new session token after each selection for future requests
    this.sessionToken = new google.maps.places.AutocompleteSessionToken();
  }

  ngOnDestroy() {
    // Clean up the autocomplete listener when the component is destroyed
    if (this.autocomplete) {
      google.maps.event.clearInstanceListeners(this.autocomplete);
    }
  }
}
