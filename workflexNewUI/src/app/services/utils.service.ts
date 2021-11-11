import { Injectable } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';


@Injectable({ providedIn: 'root' })
export class UtilsService {
    constructor(
        private _lightbox: Lightbox
    ) { }


    viewImage(src, caption, index: number = 0): void {
        // open lightbox
        const _albums = [{
            src: src,
            caption: caption || 'WorkFlexi',
            thumb: src
        }];
        this._lightbox.open(_albums, index);
    }
}