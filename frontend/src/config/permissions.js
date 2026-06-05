export const getAdminRole = () => {
  return localStorage.getItem("igsaAdminRole") || "board-member";
};

export const canDeleteMessages = () => {
  return getAdminRole() === "president";
};

export const isPresident = () => {
  return getAdminRole() === "president";
};

export const isVicePresident = () => {
  return getAdminRole() === "vice-president";
};

export const canManageAdmins = () => {
  return isPresident();
};

export const canDeleteContent = () => {
  return isPresident() || isVicePresident();
};

export const canViewEvents = () => {
  return true;
};

export const canManageEvents = () => {
  return isPresident() || isVicePresident();
};

export const canViewRegistrations = () => {
  return true;
};

export const canUseQRCheckIn = () => {
  return true;
};

export const canManageGallery = () => {
  return [
    "president",
    "vice-president",
    "social-media-manager",
    "creative-director",
    "it-director",
  ].includes(getAdminRole());
};

export const canManageBoard = () => {
  return ["president", "vice-president"].includes(getAdminRole());
};

export const canManageAnnouncements = () => {
  return [
    "president",
    "vice-president",
    "executive-secretary",
    "social-media-manager",
    "pr-director",
  ].includes(getAdminRole());
};