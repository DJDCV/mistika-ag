import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-place-autocomplete',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, CommonModule, GoogleMap],
  templateUrl: './place-autocomplete.component.html',
  styleUrls: ['./place-autocomplete.component.css']
})
export class PlaceAutocompleteComponent implements AfterViewInit {
  @ViewChild('inputField') inputField!: ElementRef;
  @Input() placeholder = 'Nombre de tu local';
  @Output() placeSelected = new EventEmitter<any>();

  autocomplete: any;

  ngAfterViewInit() {
    this.initAutocomplete();
  }

  private initAutocomplete() {
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      this.autocomplete = new google.maps.places.Autocomplete(this.inputField.nativeElement);
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        
        // Extraer los datos específicos que necesitamos
        const selectedPlace = {
          name: place.name,
          location: {
            lat: place.geometry?.location.lat(),
            lng: place.geometry?.location.lng()
          },
          rating: place.rating,
          types: place.types,
          place_id: place.place_id,
          address: place.vicinity,
          photos: place.photos ? place.photos.slice(0, 3).map((photo: { getUrl: () => any; }) => photo.getUrl()) : []
        };

        // Emitir solo los datos necesarios
        this.placeSelected.emit(selectedPlace);
      });
    } else {
      //console.error("Google Places API no disponible");
    }
  }
}
