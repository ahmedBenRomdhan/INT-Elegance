/** user components */
export const webDepartement: string = 'Département Web'
export const mobileDepartement: string = 'Département Mobile'
export const cloudDepartement: string = 'Département Cloud'
export const embeddedSystemsDepartement: string = 'Département Systèmes Embarqués'
export const automativeDepartement: string = 'Département Automotive'
export const electronicDepartement: string = 'Département Systèmes Electroniques'
export const qualityDepartement: string = 'Département Qualité & Management'
export const RHDepartement: string = 'Département Ressources Humaines'

export const departments: string[] = [
    webDepartement,
    mobileDepartement,
    cloudDepartement,
    embeddedSystemsDepartement,
    automativeDepartement,
    electronicDepartement,
    qualityDepartement,
    RHDepartement
];

export const nameColumn: string = 'Nom'
export const emailColumn: string = 'Adresse E-mail'
export const phoneNumberColumn: string = 'Téléphone Mobile'
export const roleColumn: string = 'Rôle'

export const usersCard: string = 'Liste utilisateurs'
export const searchUserPlaceholder: string = 'Rechercher Utilisateur'
export const addUserCard: string = 'Ajouter Utilisateur'
export const editUserCard: string = 'Modifier Utilisateur'
export const importUserCard: string = 'Importer Fichier'
export const profilUserCard: string = 'Détails Profil'

export const firstNamePlaceholder: string = 'Prénom'
export const lastNamePlaceholder: string = 'Nom'
export const emailPlaceholder: string = 'Adresse E-mail'
export const phoneNumberPlaceholder: string = 'Numéro Téléphone'
export const departmentLabel: string = 'Département'
export const positionPlaceholder: string = 'Fonction'
export const roleLabel: string = 'Rôle'

export const errorTypeFileMessage: string = 'Format de fichier invalide. Veuillez sélectionner un fichier Excel.';
export const errorNoFileMessage: string = 'Veuillez sélectionner un fichier Excel.';
export const legendFile: string = 'Veuillez choisir un fichier au format Excel (.xlsx ou .xls) ou CSV (.csv).\n Le fichier doit contenir nom, prénom, email, departement, position, role  '
export const templateFile: string = 'Vous pouvez télècharger le fichier excel à remplir'

export const importFileMessage: string = 'Nombre d\'utilisateurs ajoutés '
export const addUserMessage: string = 'Utilisateur Ajouté Avec Succès.'
export const editUserMessage: string = 'Utilisateur Modifié avec Succès.'
export const deleteUserMessage: string = 'Compte Utilisateur Désactivé Avec Succès.'
export const restoreUserMessage: string = 'Compte Utilisateur Activé Avec Succès.'

/** role components */

export const rolesCard: string = 'Liste rôles'
export const searchRolePlaceholder: string = 'Rechercher Rôle'
export const addRoleCard: string = 'Ajouter Rôle'
export const editRoleCard: string = 'Modifier Rôle'
export const deleteRoleCard: string = 'Supprimer Rôle'

export const roleNameColumn: string = 'Nom'
export const roleDescriptionColumn: string = 'Description'

export const roleNamePlaceholder: string = 'Nom'
export const roleDescriptionPlaceholder: string = 'Description'
export const rolePermissionsLabel: string = 'Permissions'

export const deleteRoleMessage: string = 'Êtes-vous sûr de vouloir supprimer le rôle'

export const requiredRoleName: string = 'Le nom est obligatoire.'

export const successMessageAddRole: string = 'Rôle Ajouté Avec Succès.'
export const successMessageEditRole: string = 'Rôle Modifié Avec Succès.'
export const successMessageDeleteRole: string = 'Rôle Supprimé Avec Succès.'

export const errorListRolePermission: string = "Vous n'avez pas la permission de consulter la liste des rôles. Veuillez contacter l'administrateur."