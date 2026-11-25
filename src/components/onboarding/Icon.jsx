"use client";

import {
  MdVerifiedUser,
  MdNewspaper,
  MdExpandMore,
  MdLanguage,
  MdCalendarToday,
  MdContactMail,
  MdOutlineMail,
  MdInfoOutline,
  MdLocationOn,
  MdDescription,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdRedo,
  MdBookmarkBorder,
  MdDone,
  MdArrowForward,
  MdCheck,
  MdCheckCircle,
  MdAutorenew,
  MdEditNote,
  MdAccountCircle,
  MdPersonAdd,
  MdNorthEast,
  MdVerified,
  MdArrowBack,
  MdClose,
  MdManageAccounts,
  MdLinkOff,
  MdVisibility,
  MdSync,
  MdDelete,
  MdCloudUpload,
  MdSms,
  MdSchedule,
  MdShield,
  MdAdminPanelSettings,
  MdGavel,
  MdEdit,
  MdAccountBox,
  MdSend,
  MdSmartphone,
  MdLockClock,
  MdLink,
  MdLock,
  MdMarkEmailRead,
  MdContentCopy,
} from "react-icons/md";

const ICON_MAP = {
  verified_user: MdVerifiedUser,
  newspaper: MdNewspaper,
  expand_more: MdExpandMore,
  language: MdLanguage,
  calendar_today: MdCalendarToday,
  contact_mail: MdContactMail,
  mail: MdOutlineMail,
  info: MdInfoOutline,
  location_on: MdLocationOn,
  description: MdDescription,
  format_list_bulleted: MdFormatListBulleted,
  format_list_numbered: MdFormatListNumbered,
  redo: MdRedo,
  bookmark_border: MdBookmarkBorder,
  done: MdDone,
  arrow_forward: MdArrowForward,
  check: MdCheck,
  check_circle: MdCheckCircle,
  progress_activity: MdAutorenew,
  edit_note: MdEditNote,
  account_circle: MdAccountCircle,
  person_add: MdPersonAdd,
  north_east: MdNorthEast,
  verified: MdVerified,
  arrow_back: MdArrowBack,
  close: MdClose,
  manage_accounts: MdManageAccounts,
  link_off: MdLinkOff,
  visibility: MdVisibility,
  sync: MdSync,
  delete: MdDelete,
  cloud_upload: MdCloudUpload,
  sms: MdSms,
  schedule: MdSchedule,
  shield: MdShield,
  admin_panel_settings: MdAdminPanelSettings,
  gavel: MdGavel,
  edit: MdEdit,
  account_box: MdAccountBox,
  send: MdSend,
  smartphone: MdSmartphone,
  lock_clock: MdLockClock,
  link: MdLink,
  lock: MdLock,
  mark_email_read: MdMarkEmailRead,
  content_copy: MdContentCopy,
};

export default function Icon({ name, className = "", size = null }) {
  const IconComponent = ICON_MAP[name];

  if (!IconComponent) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
  }

  let iconSize = size;
  if (!iconSize && className) {
    const match = className.match(/text-\[(\d+)px\]/);
    if (match) {
      iconSize = parseInt(match[1], 10);
    }
  }

  return (
    <IconComponent
      size={iconSize || 20}
      className={`inline-block shrink-0 ${className}`}
      style={iconSize ? { fontSize: `${iconSize}px`, width: `${iconSize}px`, height: `${iconSize}px` } : undefined}
      aria-hidden="true"
    />
  );
}
