import { User } from "src/app/core/user/model/user";
import { ApiResourceInterface } from "src/app/models/api-resource.interface";
import { environment } from "src/environments/environment";

export class Meeting implements ApiResourceInterface {
    public id?: number;
    public title: string;
    public roomId: string;
    public start: string;
    public end: string;
    public startTime: string;
    public endTime: string;
    public createdBy: number;
    public color: string;
    public users: Array<User>;
    public description: string;

    constructor(title: string, room: string, startDate: string, endDate: string, startTime: string, endTime: string, createdBy: number, color: string, description: string) {
        this.title = title;
        this.roomId = room;
        this.start = startDate;
        this.end = endDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.createdBy = createdBy;
        this.users = [];
        this.color = color;
        this.description = description
    }

    // tslint:disable-next-line:typedef
    setId(id: string | any) {
        this.id = id;
    }
    getCollectionUri() {
        return environment.apiUrl + 'meeting'
    }
    getItemUri() {
        return environment.apiUrl + 'meeting/' + this.id;
    }
    getSubResourceUri() {
        throw new Error("Method not implemented.");
    }
}
