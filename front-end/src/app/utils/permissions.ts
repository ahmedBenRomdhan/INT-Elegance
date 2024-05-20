/** ROLES PERMISSIONS */
export const listRolesPermission: string = '/role/'
export const addRolesPermission: string = '/role/add'
export const editRolesPermission: string = '/role/:id/edit'
export const deleteRolesPermission: string = '/role/:id/delete'

/** USERS PERMISSIONS */
export const listUsersPermission: string = '/user/'
export const addUsersPermission: string = '/user/add'
export const importUsersilePermission: string = '/user/importFile'
export const editUsersPermission: string = '/user/:id/edit'
export const desactivateUsersPermission: string = '/user/:id/delete'
export const restoreUsersPermission = '/user/:id/restore'
export const getUserPermission: string = '/user/:id/getOne'
export const editUserProfilePermission: string = '/user/:id/profile'
export const trailUsersPermission: string = '/trail/users'

/** PROJECT PERMISSIONS */
export const listProjectsPermission: string = '/project/'
export const addProjectsPermission: string = '/project/add'
export const editProjectsPermission: string = '/project/:id/edit'
export const deleteProjectsPermission: string = '/project/:id/delete'
export const getProjectDetailsPermission: string = '/project/:id/getOne'
export const trailProjectPermission: string = '/trail/project/:id'
export const affectUsersProjectsPermission: string = '/project/:id/affectUsersProject'

/** PHASE PERMISSIONS */
export const addPhasessPermission: string = '/phase/add'
export const editPhasesPermission: string = '/phase/:id/edit'
export const deletePhasesPermission: string = '/phase/:id/delete'

/** TASK PERMISSIONS */
export const addTasksPermission: string = '/task/add'
export const addChildTasksPermission: string = '/task/addChild/:parentId'
export const editTasksPermission: string = '/task/:id/edit'
export const deleteTasksPermission: string = '/task/:id/delete'
export const trailTasksPermission: string = '/trail/task/:id'
export const changeTasksStatusPermission: string = '/changeStatus'

/** MEETING PERMISSIONS */
export const listMeetingsPermission: string = '/meeting/incoming'
export const showCalendarsPermission: string = '/meeting/'
export const addMeetingsPermission: string = '/meeting/add'
export const editMeetingsPermission: string = '/meeting/:id/edit'
export const deleteMeetingsPermission: string = '/meeting/:id/delete'

/** DASHBOARD PERMISSION */
export const showDashboardPermission: string = '/dashboard'

/**CHAT PERMISSION */
export const chatPermission: string = '/chat/'