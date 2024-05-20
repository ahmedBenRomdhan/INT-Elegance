import { completedStatus, inProgressStatus, newStatus } from "./variables";

export interface Legend {
    name: string;
    icon: string;
    color?: string;
    active: boolean; 
}

export const legendStatus: Legend[] = [
    {
        name: newStatus,
        icon: 'label',
        color: '#26c6da',
        active: false
    },
    {
        name: inProgressStatus,
        icon: 'label',
        color: '#ffb22b',
        active: false
    },
    {
        name: completedStatus,
        icon: 'label',
        color: '#009688',
        active: false
    },
];