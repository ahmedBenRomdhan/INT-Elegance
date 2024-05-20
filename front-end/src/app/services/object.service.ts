// import { Injectable } from '@angular/core';
// import { PartialCollectionView } from '../models/hydra.model';
// // @ts-ignore
// import * as s from '../models/all';
//
// @Injectable()
// export class ObjectService {
//   // tslint:disable-next-line:typedef
//   hydrateFromApi(rootClass: object, json: string) {
//     return Object.assign(rootClass, JSON.parse(json, (key, value) => {
//       if (value
//         && value['@type']
//         && (!Array.isArray(value))
//         && (typeof value === 'object')
//         && (value['@type'] !== 'hydra:Collection')
//         && (value['hydra:search'])) {
//         if (value['@type'] === 'hydra:PartialCollectionView') {
//           return Object.assign(new PartialCollectionView(), value);
//         } else {
//           return Object.assign(
//             this.createClass(value['@type']),
//             value
//           );
//         }
//       }
//
//       return value;
//     }));
//   }
//
//   // tslint:disable-next-line:typedef
//   createClass(className: string) {
//     return new s[className]();
//   }
// }
