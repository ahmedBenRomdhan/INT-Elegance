import { ApiResourceInterface } from "src/app/models/api-resource.interface";
import { environment } from "src/environments/environment";

export class User implements ApiResourceInterface {
    id?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    phoneNumber?: string;
    department?: string;
    position?: string;
    image?: string;
    roleId?: string;

    constructor(email: string, password?: string, firstName?: string, lastName?: string,  phoneNumber?: string, department?: string, position?: string, image?: string, roleId?: string) {
        this.password = password
        this.email = email
        this.firstName = firstName
        this.lastName = lastName
        this.phoneNumber = phoneNumber
        this.department = department
        this.position = position
        this.image = image
        this.roleId = roleId

    }
    // tslint:disable-next-line:typedef
    setId(id: string | any) {
        this.id = id;
    }
    // tslint:disable-next-line:typedef
    getPassword() {
        return this.password;
    }
    getCollectionUri() {
        return `${environment.apiUrl}`
    }
    getItemUri() {
        return `${environment.apiUrl}/user/` + this.id;
    }
    getSubResourceUri() {
        throw new Error("Method not implemented.");
    }

}
