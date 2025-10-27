export interface Text {
  id: string;
  key: TextKey;
  value: string;
}

export enum TextKey {
  SLOGAN = 'slogan',

  SUPPORT_DONATE_MATERIAL_TITLE = 'supportDonateMaterialTitle',
  SUPPORT_DONATE_MATERIAL_BODY = 'supportDonateMaterialBody',
  SUPPORT_DONATE_SWISH_TITLE = 'supportDonateSwishTitle',
  SUPPORT_DONATE_SWISH_BODY = 'supportDonateSwishBody',
  SUPPORT_WORK_TITLE = 'supportWorkTitle',
  SUPPORT_WORK_BODY = 'supportWorkBody',
  SUPPORT_PARTNER_TITLE = 'supportPartnerTitle',
  SUPPORT_PARTNER_BODY = 'supportPartnerBody',

  SERVICE_REPAIR_TITLE = 'serviceRepairTitle',
  SERVICE_REPAIR_BODY = 'serviceRepairBody',
  SERVICE_RENT_TITLE = 'serviceRentTitle',
  SERVICE_RENT_BODY = 'serviceRentBody',
  SERVICE_COURSES_TITLE = 'serviceCoursesTitle',
  SERVICE_COURSES_BODY = 'serviceCoursesBody',
  SERVICE_COMMUNITY_TITLE = 'serviceCommunityTitle',
  SERVICE_COMMUNITY_BODY = 'serviceCommunityBody',

  SERVICES_HOW_TO_REPAIR = 'servicesHowToRepair',
  SERVICES_FOOTER_NOTE = 'servicesFooterNote',
  SERVICES_FIND_SHOP = 'servicesFindShop',
  SERVICES_FIND_EVENT = 'servicesFindEvent',

  SERVICES_VISIT = 'servicesVisit',
  SERVICES_NO_ONLINE_BOOKING = 'servicesNoOnlineBooking',
  SERVICES_TELL_US = 'servicesTellUs',
  SERVICES_INSPECT_TOGETHER = 'servicesInspectTogether',
  SERVICES_SIMPLE_FIX = 'servicesSimpleFix',
  SERVICES_DONE_RIGHT_AWAY = 'servicesDoneRightAway',
  SERVICES_MORE_TIME = 'servicesMoreTime',
  SERVICES_LEAVE_IT_WITH_US = 'servicesLeaveItWithUs',
  SERVICES_PICK_IT_UP = 'servicesPickItUp',
  SERVICES_WE_WILL_LET_YOU_KNOW = 'servicesWeWillLetYouKnow',

  SERVICES_HOW_TO_RENT = 'servicesHowToRent',
  SERVICES_PICK_A_VEHICLE = 'servicesPickAVehicle',
  SERVICES_HELP_YOU_CHOSE = 'servicesHelpYouChose',
  SERVICES_USE_FOR_WEEKS = 'servicesUseForWeeks',
  SERVICES_FREE_OF_CHARGE = 'servicesFreeOfCharge',
  SERVICES_RETURN = 'servicesReturn',
  SERVICES_RETURN_VEHICLE = 'servicesReturnVehicle',

  SERVICES_JOIN_COURSE = 'servicesJoinCourse',
  SERVICES_VIEW_COURSES = 'servicesViewCourses',
  SERVICES_VIEW_WHATS_RIGHT = 'servicesViewWhatsRight',
  SERVICES_REGISTER_FOR_EVENT = 'servicesRegisterForEvent',
  SERVICES_SIGN_UP_ONLINE = 'servicesSignUpOnline',
  SERVICES_CHECK_INBOX = 'servicesCheckInbox',
  SERVICES_CONFIRMATION_MAIL = 'servicesConfirmationMail',
  SERVICES_SHOW_UP_AND_JOIN = 'servicesShowUpAndJoin',
  SERVICES_COME_AT_SCHEDULED_TIME = 'servicesComeAtScheduledTime',

  SHOPS_WELCOME_TITLE = 'shopsWelcomeTitle',
  SHOPS_WELCOME_SUBHEADING = 'shopsWelcomeSubheading',
  SHOPS_WELCOME_BODY = 'shopsWelcomeBody',
  SHOP_BUTTON_LABEL_ABOUT_SERVICES = 'shopButtonLabelAboutServices',
  SHOP_DETAIL_JUST_DROP_BY_TITLE = 'shopDetailJustDropByTitle',
  SHOP_DETAIL_JUST_DROP_BY_BODY_BOLD = 'shopDetailJustDropByBodyBold',
  SHOP_DETAILS_JUST_DROP_BY_BODY_REGULAR = 'shopDetailsJustDropByBodyRegular',

  BIKE_DETAIL_RENT_TEXT = 'bikeDetailRentText',
}
