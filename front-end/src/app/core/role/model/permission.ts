import { ApiResourceInterface } from "src/app/models/api-resource.interface";
import { environment } from "src/environments/environment";

export class Permission implements ApiResourceInterface {
    id?: string;
    name: string;
    path: string;
    groupName: string;

    constructor(name: string, path: string, groupName: string ) {
        this.name = name;
        this.path = path;
        this.groupName = groupName
    }
    // tslint:disable-next-line:typedef
    setId(id: string | any) {
        this.id = id;
    }
    getCollectionUri() {
        return environment.apiUrl + 'permission'
    }
    getItemUri() {
        return environment.apiUrl + 'permission/' + this.id;
    }
    getSubResourceUri() {
        throw new Error("Method not implemented.");
    }
}


