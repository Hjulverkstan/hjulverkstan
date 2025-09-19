import React from 'react';
import {
  Bike,
  BookOpen,
  Calendar,
  CheckCircle,
  ClipboardCheck,
  Hammer,
  LogIn,
  Mail,
  MapPin,
  MessageCircle,
  User,
  Wrench,
} from 'lucide-react';

import { Page } from '@components/Page';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { CardServices, CardServicesSteps } from '@components/CardServices';

type General = Record<string, string>;

export const ServicesRepairCardView: React.FC<{
  mode?: 'page' | 'dialog';
  general: General;
}> = ({ mode = 'page', general }) => (
  <CardServices
    mode={mode}
    title={general.servicesHowToRepair}
    icon={Hammer}
    footerNote={general.servicesFooterNote}
    linkLabel={general.servicesFindShop}
    linkDestination="/shops"
  >
    <CardServicesSteps
      icon={MapPin}
      label={general.servicesVisit}
      description={general.servicesNoOnlineBooking}
    />
    <CardServicesSteps
      icon={MessageCircle}
      label={general.servicesTellUs}
      description={general.servicesInspectTogether}
    />
    <CardServicesSteps
      icon={Wrench}
      label={general.servicesSimpleFix}
      description={general.servicesDoneRightAway}
    />
    <CardServicesSteps
      icon={Calendar}
      label={general.servicesMoreTime}
      description={general.servicesLeaveItWithUs}
    />
    <CardServicesSteps
      icon={LogIn}
      label={general.servicesPickItUp}
      description={general.servicesWeWillLetYouKnow}
    />
  </CardServices>
);

export const ServicesHowToRentView: React.FC<{
  mode?: 'page' | 'dialog';
  general: General;
}> = ({ mode = 'page', general }) => (
  <CardServices
    mode={mode}
    title={general.servicesHowToRent}
    icon={Bike}
    linkLabel={general.servicesFindShop}
    linkDestination="/shops"
  >
    <CardServicesSteps
      icon={MapPin}
      label={general.servicesVisit}
      description={general.servicesNoOnlineBooking}
    />
    <CardServicesSteps
      icon={CheckCircle}
      label={general.servicesPickAVehicle}
      description={general.servicesHelpYouChose}
    />
    <CardServicesSteps
      icon={Calendar}
      label={general.servicesUseForWeeks}
      description={general.servicesFreeOfCharge}
    />
    <CardServicesSteps
      icon={LogIn}
      label={general.servicesReturn}
      description={general.servicesReturnVehicle}
    />
  </CardServices>
);

export const ServicesJoinCourseView: React.FC<{
  mode?: 'page' | 'dialog';
  general: General;
}> = ({ mode = 'page', general }) => (
  <CardServices
    mode={mode}
    title={general.servicesJoinCourse}
    icon={User}
    linkLabel={general.servicesFindEvent}
    linkDestination="/stories"
  >
    <CardServicesSteps
      icon={BookOpen}
      label={general.servicesViewCourses}
      description={general.servicesViewWhatsRight}
    />
    <CardServicesSteps
      icon={ClipboardCheck}
      label={general.servicesRegisterForEvent}
      description={general.servicesSignUpOnline}
    />
    <CardServicesSteps
      icon={Mail}
      label={general.servicesCheckInbox}
      description={general.servicesConfirmationMail}
    />
    <CardServicesSteps
      icon={MapPin}
      label={general.servicesShowUpAndJoin}
      description={general.servicesComeAtScheduledTime}
    />
  </CardServices>
);

export default function Services() {
  const { data } = usePreloadedDataLocalized();
  const general = data.generalContent;

  return (
    <Page heading={general.servicesTitle} variant="muted">
      <Section variant="muted">
        <SectionContent>
          <div
            className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2
              xl:grid-cols-3"
          >
            <ServicesRepairCardView general={general} />
            <ServicesHowToRentView general={general} />
            <ServicesJoinCourseView general={general} />
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
