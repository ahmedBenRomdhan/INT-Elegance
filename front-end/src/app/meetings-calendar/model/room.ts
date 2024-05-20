import { ApiResourceInterface } from "src/app/models/api-resource.interface";
import { environment } from "src/environments/environment";

export class Room implements ApiResourceInterface {
    public id?: number;
    public name: string;
    public availability: boolean;

    constructor(name: string, availability: boolean) {
        this.name = name;
        this.availability = availability
    }

    // tslint:disable-next-line:typedef
    setId(id: string | any) {
        this.id = id;
    }
    getCollectionUri() {
        return environment.apiUrl + 'room'
    }
    getItemUri() {
        return environment.apiUrl + 'room/' + this.id;
    }
    getSubResourceUri() {
        throw new Error("Method not implemented.");
    }
}
