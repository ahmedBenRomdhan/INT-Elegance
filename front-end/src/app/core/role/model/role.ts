import { ApiResourceInterface } from "src/app/models/api-resource.interface";
import { environment } from "src/environments/environment";

export class Role implements ApiResourceInterface {
    id?: string;
    name: string;
    description: string;
    permissions: Array<string>

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.permissions = []
    }
    // tslint:disable-next-line:typedef
    setId(id: string | any) {
        this.id = id;
    }
    getCollectionUri() {
        return environment.apiUrl + 'role'
    }
    getItemUri() {
        return environment.apiUrl + 'role/' + this.id;
    }
    getSubResourceUri() {
        throw new Error("Method not implemented.");
    }
}


