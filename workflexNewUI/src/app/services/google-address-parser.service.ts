import { Injectable } from "@angular/core";

interface AddressComponent {
    long_name: string;
    short_name: string;
    types: Array<string>;
  }
  
  interface Address {
    street_number?: string;
    street_name?: string;
    city?: string;
    postal_code?: string;
    state?: string;
    country?: string;
  }
  
  @Injectable({
    providedIn: 'root'
  })
  export class GoogleAddressParserService {
    private address: Address = {};
    address_components: any;
  
    constructor() {
    }
  
    private parseAddress(address_components: Array<AddressComponent>) {
        this.address_components = address_components;
        this.address = {};
      if (!Array.isArray(this.address_components)) {
        throw Error('Address Components is not an array');
      }
  
      if (!this.address_components.length) {
        throw Error('Address Components is empty');
      }
  
      for (let i = 0; i < this.address_components.length; i++) {
        const component: AddressComponent = this.address_components[i];
  
        if (this.isStreetNumber(component)) {
          this.address.street_number = component.long_name;
        }
  
        if (this.isStreetName(component)) {
          this.address.street_name = component.long_name;
        }
  
        if (this.isCity(component)) {
          this.address.city = component.long_name;
        }

        if (this.isPostalCode(component)) {
            this.address.postal_code = component.long_name;
          }
  
        if (this.isCountry(component)) {
          this.address.country = component.long_name;
        }
  
        if  (this.isState(component)) {
          this.address.state = component.long_name;
        }
      }
    }
  
    private isStreetNumber(component: AddressComponent): boolean {
      return component.types.includes('street_number');
    }
  
    private isStreetName(component: AddressComponent): boolean {
      return component.types.includes('route');
    }
  
    private isCity(component): boolean {
      return component.types.includes('locality');
    }
  
    private isState(component): boolean {
      return component.types.includes('administrative_area_level_1');
    }
  
    private isCountry(component): boolean {
      return component.types.includes('country');
    }
  
    private isPostalCode(component): boolean {
      return component.types.includes('postal_code');
    }

    getAddressAsString(address_components: Array<AddressComponent>): string {
        this.parseAddress(address_components);
        return Object.values(this.address).join(",");
      }
  }