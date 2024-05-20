export const applicatioWeb: string = 'Application Web'
export const applicationMobile: string = 'Application Mobile'
export const embeddedSystem: string = 'Système Embarqué'
export const electronicSystem: string = 'Système Electronique'

export const types: string[] = [
    applicatioWeb,
    applicationMobile,
    embeddedSystem,
    electronicSystem
];

export const newStatus: string = "New"
export const inProgressStatus: string = "In Progress"
export const completedStatus: string = "Completed"
export const resolvedStatus: string = "Resolved"
export const integratedStatus: string = "Integrated"
export const canceledStatus: string = "Canceled"

export const trackers: string[] = [
    'Task',
    'Bug',
    'Feature',
    'Remark',
    'Item',
    'Action'
]

export const lowPriority: string = 'Faible'
export const mediumPriority: string = 'Moyenne'
export const highPriority: string = 'Elevé'
export const criticalPriority: string = 'Critique'

export const priorities: string[] = [
    lowPriority,
    mediumPriority,
    highPriority,
    criticalPriority
];

export const errorEndDateMessage: string = 'La date de fin doit étre supérieur à la date de début '
export const errorMinDateMessage: string = "Vérifiez que la date est supérieur à la date d'aujourd'hui";

export const backlog: string = 'Backlog'
export const otherTasks: string = 'Autres Tickets'

export const NB: string = `Pour q\'un projet sera ${inProgressStatus} il doit contenir au moins un ticket. On ne peut pas terminé un projet que lorsque tous ses tickets seront terminés`
export const otherLabel: string = "autre"
export const othersLabel: string = "autres"
