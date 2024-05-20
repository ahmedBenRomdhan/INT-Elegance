import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {ApiHelperService} from './api.helper.service';
// import {ObjectService} from './object.service';
import {ApiResourceInterface} from '../models/api-resource.interface';
// import {HydraCollection} from '../models/hydra.model';
import {map} from 'rxjs/operators';
import  { environment } from "../../environments/environment"

/*
 * Generic service
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private apiHelperService: ApiHelperService,
    // private objectService: ObjectService
  ) {
  }


  /**
   * Method getCollection
   * @param resourceObject The object type to get
   * @param routeSuffix A suffix for custom routes
   * @return Full HTTP response as Observable
   */
  // @ts-ignore
  public getCollection(resourceObject : ApiResourceInterface, routeSuffix = null): Observable<HydraCollection> {

    return this.sendRequest(
      'get',
      (routeSuffix !== null) ?  resourceObject.getCollectionUri() + routeSuffix : resourceObject.getCollectionUri(),
      new HttpHeaders(),
      new HttpParams(),
      null
    )
      .pipe(
        map((res) => {
          return res.body;
        })
      );
  }

  // /**
  //  * Method getItem
  //  * @param resourceObject the object to get
  //  * @param routeSuffix A suffix for custom routes
  //  * @return Full HTTP response as Observable
  //  */
  // @ts-ignore
  public getItem(resourceObject, routeSuffix = null): Observable<any> {
    return this.sendRequest(
      'get',
      (routeSuffix !== null) ? resourceObject.getItemUri() + routeSuffix : resourceObject.getItemUri(),
      new HttpHeaders(),
      new HttpParams(),
      null
    )
      .pipe(
        map((res) => {
          // @ts-ignore
          return  res.body;
        })
      );
  }


  //
  /**
   * Method postItem
   * @param resource The new any resource
   * @param routeSuffix A suffix for custom routes
   * @param body The request body
   * @return Full HTTP response as Observable
   */
  // @ts-ignore
  public postItem(resource: ApiResourceInterface, routeSuffix = null, body: any): Observable<HttpResponse<any>> {   
    return this.sendRequest(
      'post',
      (routeSuffix !== null) ? resource.getCollectionUri() + routeSuffix : resource.getCollectionUri(),
      new HttpHeaders().set('Content-Type', 'application/json'),
      new HttpParams(),
      body
    )
  .pipe(
      map((res) => {
        // @ts-ignore
        return  res.body;
      })
    )
  }


  public postItemFD(resource: ApiResourceInterface, routeSuffix = null, body: FormData): Observable<HttpResponse<any>> {
    return this.sendRequest(
      'post',
      (routeSuffix !== null) ? resource.getCollectionUri() + routeSuffix : resource.getCollectionUri(),
      new HttpHeaders(),
      new HttpParams(),
      body

  )
  }


  // @ts-ignore
  public postItemLog(resource: ApiResourceInterface, routeSuffix = null, body  : any): Observable<any> {
    return this.sendRequest(
      'post',
      (routeSuffix !== null) ? resource.getCollectionUri() + routeSuffix : resource.getCollectionUri(),
      new HttpHeaders().set('Content-Type', 'application/json'),
      new HttpParams(),
      body
    )
      .pipe(
        map((res) => {
          // @ts-ignore
          return  res.body;
        })
      );
  }
  // /**
  //  * Method putItem
  //  * @param resource The updated any resource
  //  * @param routeSuffix A suffix for custom routes
  //  * @param body The request body
  //  * @return Full HTTP response as Observable
  //  */
  public putItem(resource: ApiResourceInterface, routeSuffix = null, body: any): Observable<HttpResponse<any>> {
    return this.sendRequest(
      'put',
      (routeSuffix !== null) ? resource.getItemUri() + routeSuffix : resource.getItemUri(),
      new HttpHeaders().set('Content-Type', 'application/json'),
      new HttpParams(),
      body
    );
  }
  public putItemFD(resource: ApiResourceInterface, routeSuffix = null, body: FormData): Observable<HttpResponse<any>> {
    return this.sendRequest(
      'put',
      (routeSuffix !== null) ? resource.getItemUri() + routeSuffix : resource.getItemUri(),
      new HttpHeaders(),
      new HttpParams(),
      body
    );
  }
  // /**
  //  * Method deleteItem
  //  * @param resource The deleted resource
  //  * @param routeSuffix A suffix for custom routes
  //  * @param body
  //  * @return Full HTTP response as Observable
  //  */
  public deleteItem(resource: ApiResourceInterface, routeSuffix = null ): Observable<HttpResponse<any>> {
    console.log(routeSuffix);
    
    return this.sendRequest(
      'delete',
      (routeSuffix !== null) ? resource.getItemUri() + routeSuffix : resource.getItemUri(),
      new HttpHeaders(),
      new HttpParams(),
      null
    );
  }
  //
  // /**
  //  * Method getSubResources
  //  * @param resourceObject the parent object
  //  * @param subResource the objects to get
  //  * @param routeSuffix A suffix for custom routes and parameters
  //  * @return Full HTTP response as Observable
  //  */
  // // @ts-ignore
  // // public getSubResources(resourceObject, subResource: ApiResourceInterface, routeSuffix = null): Observable<HydraCollection> {
  // //   return this.sendRequest(
  // //     'get',
  // //     (routeSuffix !== null)
  // //       ? resourceObject.getItemUri() + '/' + subResource.getCollectionUri() + routeSuffix
  // //       : resourceObject.getItemUri() + '/' + subResource.getCollectionUri(),
  // //     new HttpHeaders(),
  // //     new HttpParams(),
  // //     null
  // //   )
  // //     .pipe(
  // //       map((res) => {
  // //         return this.objectService.hydrateFromApi(new HydraCollection(), JSON.stringify(res.body));
  // //       })
  // //     );
  // // }
  //
  // /**
  //  * Method getSubResource
  //  * @param resourceObject the parent object
  //  * @param subResource the objects to get
  //  * @param routeSuffix A suffix for custom routes and parameters
  //  * @return Full HTTP response as Observable
  //  */
  // // @ts-ignore
  // // public getSubResource(resourceObject, subResource: ApiResourceInterface, routeSuffix = null): Observable<any> {
  // //   return this.sendRequest(
  // //     'get',
  // //     (routeSuffix !== null)
  // //       ? resourceObject.getItemUri() + '/' + subResource.getSubResourceUri() + routeSuffix
  // //       : resourceObject.getItemUri() + '/' + subResource.getSubResourceUri(),
  // //     new HttpHeaders(),
  // //     new HttpParams(),
  // //     null
  // //   )
  // //     .pipe(
  // //       map((res) => {
  // //         return this.objectService.hydrateFromApi(subResource, JSON.stringify(res.body));
  // //       })
  // //     );
  // // }
  //
  // /**
  //  *
  //  * @param method request method
  //  * @param uri request uri
  //  * @param headers request headers
  //  * @param params request params
  //  * @param body request body
  //  */
  public sendRequest(method: string, uri: string, headers: HttpHeaders, params: HttpParams, body: any) {
    return this.apiHelperService.sendApiRequest<any>(method, uri, headers, params, body);
  }

}
