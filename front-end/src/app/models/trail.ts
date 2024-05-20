
import { ApiResourceInterface } from "src/app/models/api-resource.interface";
import { environment } from "src/environments/environment";

export class Trail implements ApiResourceInterface {

    id?: string;
    eventType!: string;
    entityId!: string;
    entityName!: string;
    oldValues!: string;
    newValues!: string;
    attributes!: string;
    userId!: string;

    constructor() { }

    getCollectionUri() {
        return environment.apiUrl + 'trail'
    }
    getItemUri() {
        return environment.apiUrl + 'trail/' + this.id;
    }
    getSubResourceUri() {
        throw new Error("Method not implemented.");
    }
}
