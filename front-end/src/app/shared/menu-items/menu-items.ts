import { Injectable } from '@angular/core';
import { chatPermission, listMeetingsPermission, listProjectsPermission, listRolesPermission, listUsersPermission, showDashboardPermission } from 'src/app/utils/permissions';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface SubChildren {
  state: string;
  name: string;
  type?: string;
}
export interface ChildrenItems {
  permission?: string;
  state: string;
  name: string;
  type?: string;
  child?: SubChildren[];
}

export interface Menu {
  permission?: string;
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {
    state: 'dashboard',
    name: 'Dashboard',
    type: 'link',
    icon: 'dashboard',
    permission: showDashboardPermission
  },
  {
    state: 'meeting',
    name: 'Calendrier',
    type: 'link',
    icon: 'calendar_today',
    permission: listMeetingsPermission
  },
  {
    state: 'user',
    name: 'Gestion utilisateurs',
    type: 'sub',
    icon: 'person',
    children: [
      {
        state: 'list',
        name: 'Liste utilisateurs',
        type: 'link',
        permission: listUsersPermission
      },
      {
        state: 'roles', name: 'Liste rôles', type: 'link', permission: listRolesPermission
      },
    ],
  },
  {
    state: 'list_projects',
    name: 'Gestion projets',
    type: 'link',
    icon: 'layers',
    permission: listProjectsPermission
  },

  {
    state: 'chat',
    name: 'Chat',
    type: 'link',
    icon: 'chat',
    permission: chatPermission
  },

  /*{
    state: 'user',
    name: 'Profile',
    type: 'link',
    icon: 'perm_contact_calendar',
  },*/
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
