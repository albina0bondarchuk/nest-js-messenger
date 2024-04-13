export const DELETED_STATUS = 0;
export const ACTIVE_STATUS = 1;

export const PUBLIC_TYPE = 1;
export const PRIVATE_TYPE = 2;

enum PrivacyStatuses {
  NOBODY = 0,
  MY_CONTACTS = 1,
  EVERYBODY = 2
}

export const DefaultUserSettings = {
  privacy: {
    phoneNumber: PrivacyStatuses.MY_CONTACTS,
    lastSeen: PrivacyStatuses.MY_CONTACTS,
    profilePhoto: PrivacyStatuses.MY_CONTACTS,
    calls: PrivacyStatuses.MY_CONTACTS,
    forwardedMessages: PrivacyStatuses.EVERYBODY,
    groupsAndChannels: PrivacyStatuses.EVERYBODY
  }
};
