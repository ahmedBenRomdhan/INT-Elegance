import { ApiResourceInterface } from "src/app/models/api-resource.interface";
import { environment } from "src/environments/environment";

export class Task implements ApiResourceInterface {

    public id?: number;
    public name: string;
    public type: string;
    public status: string;
    public priority: string;
    public startDate: Date;
    public endDate: Date;
    public estimatedTime: number;
    public realisation: number;
    public comment?: string;
    public phaseId: string;
    public parentId: number;
    public userId: string;
    public url: string;
    public passedTime : number;
    public subtasks: Task[]=[];
    public doneChildrenTasks?:boolean;

    constructor(
        name: string,
        type: string,
        status: string,
        priority: string,
        startDate: Date,
        endDate: Date,
        estimatedTime: number,
        realisation: number,
        parentId: number,
        phaseId: string,
        url: string,
        userId: string,
        passedTime:number
    ) {
        this.name = name;
        this.type = type;
        this.status = status;
        this.priority = priority;
        this.startDate = startDate;
        this.endDate = endDate;
        this.estimatedTime = estimatedTime;
        this.realisation = realisation;
        this.parentId = parentId;
        this.url = url;
        this.phaseId = phaseId
        this.userId = userId
        this.passedTime = passedTime
    }

    // tslint:disable-next-line:typedef
    setId(id: number | any) {
        this.id = id;
    }

    getCollectionUri() {
        return environment.apiUrl + 'task'
    }
    getItemUri() {
        return environment.apiUrl + 'task/' + this.id;
    }
    getSubResourceUri() {
        throw new Error("Method not implemented.");
    }
}
