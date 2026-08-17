import { TranslationKey } from '@/lib/i18n';

// Define user roles
export type UserRole = "SuperAdmin" | "ProjectManager" | "User" | "Reviewer" | "QualityAssurance" | "Facilitator" | "Contributor" | null;

// Define menu item structure
export interface MenuItem {
  labelKey: TranslationKey;
  href: string;
  iconName: string;
  roles: UserRole[];
  subItems?: { labelKey: TranslationKey; href: string }[];
}


export const menuConfig: MenuItem[] = [
  {
    labelKey: "dashboard",
    href: "/superadmin",
    iconName: "overview",
    roles: ["SuperAdmin"],
  },
  {
    labelKey: "dashboard",
    href: "/projectmanager",
    iconName: "overview",
    roles: ["ProjectManager",],
  },
  {
    labelKey: "dashboard",
    href: "/dashboard",
    iconName: "overview",
    roles: ["User"],
  },
  {
    labelKey: "userManagement",
    href: "/superadmin/users",
    iconName: "userManagement",
    roles: ["SuperAdmin"],
  },
  {
    labelKey: "projectManagement",
    href: "/superadmin/project",
    iconName: "projectManagement",
    roles: ["SuperAdmin"],
  },
  {
    labelKey: "dashboard",
    href: "/reviewer",
    iconName: "overview",
    roles: ["Reviewer"],
  },
  {
    labelKey: "tasks",
    href: "/reviewer/tasks",
    iconName: "projectManagement",
    roles: ["Reviewer"],
  },
   {
    labelKey: "dashboard",
    href: "/qualityAssurance/tasks",
    iconName: "overview",
    roles: ["QualityAssurance",],
  },
  {
    labelKey: "tasks",
    href: "/qualityAssurance/tasks",
    iconName: "projectManagement",
    roles: ["QualityAssurance"],
  },

  {
    labelKey: "tasks",
    href: "/facilitator/",
    iconName: "overview",
    roles: ["Facilitator"],
  },
  {
    labelKey: "dashboard",
    href: "/contributor",
    iconName: "overview",
    roles: ["Contributor"],
  },
  {
    labelKey: "tasks",
    href: "/contributor/tasks",
    iconName: "projectManagement",
    roles: ["Contributor"],
  },
  {
    labelKey: "baseData",
    href: "",
    iconName: "baseData",
    roles: ["SuperAdmin"],
    subItems: [
      { labelKey: "language", href: "/superadmin/basedata/language" },
      { labelKey: "dialect", href: "/superadmin/basedata/dialect" },
      { labelKey: "sector", href: "/superadmin/basedata/sector" },
      { labelKey: "organization", href: "/superadmin/basedata/organization" },
      { labelKey: "country", href: "/superadmin/basedata/country" },
      { labelKey: "region", href: "/superadmin/basedata/region" },
      { labelKey: "zone", href: "/superadmin/basedata/zone" },
      { labelKey: "rejectionType", href: "/superadmin/basedata/rejectionType" },
      { labelKey: "annotationType", href: "/superadmin/basedata/annotationType" },
      { labelKey: "annotation", href: "/superadmin/basedata/annotation" },
      { labelKey: "flagType", href: "/superadmin/basedata/flagType" },
    ],
  },
  {
    labelKey: "archive",
    href: "/superadmin/projectArchive",
    iconName: "archive",
    roles: ["SuperAdmin"],
  },
  {
    labelKey: "settings",
    href: "/superadmin/setting",
    iconName: "settings",
    roles: ["SuperAdmin"],
  },

  {
    labelKey: "systemLog",
    href: "/superadmin/log",
    iconName: "log",
    roles: ["SuperAdmin"],
  },


  {
    labelKey: "projects",
    href: "/projectmanager/project",
    iconName: "projectManagement",
    roles: ["ProjectManager"],
  },
  {
    labelKey: "settings",
    href: "/",
    iconName: "settings",
    roles: ["ProjectManager"],
  },

  {
    labelKey: "helpSupport",
    href: "/help",
    iconName: "help",
    roles: ["SuperAdmin", "ProjectManager", "User", "Reviewer", "Facilitator","QualityAssurance", "Contributor"],
  },
];