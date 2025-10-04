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

type T = Record<string, string>;

export const ServicesRepairCardView: React.FC<{
  mode?: 'page' | 'dialog';
  t: T;
}> = ({ mode = 'page', t }) => {
  return (
    <CardServices
      mode={mode}
      title={t.servicesHowToRepair}
      icon={Hammer}
      footerNote={t.servicesFooterNote}
      linkLabel={t.servicesFindShop}
      linkDestination="/shops"
    >
      <CardServicesSteps
        icon={MapPin}
        label={t.servicesVisit}
        description={t.servicesNoOnlineBooking}
      />
      <CardServicesSteps
        icon={MessageCircle}
        label={t.servicesTellUs}
        description={t.servicesInspectTogether}
      />
      <CardServicesSteps
        icon={Wrench}
        label={t.servicesSimpleFix}
        description={t.servicesDoneRightAway}
      />
      <CardServicesSteps
        icon={Calendar}
        label={t.servicesMoreTime}
        description={t.servicesLeaveItWithUs}
      />
      <CardServicesSteps
        icon={LogIn}
        label={t.servicesPickItUp}
        description={t.servicesWeWillLetYouKnow}
      />
    </CardServices>
  );
};

export const ServicesHowToRentView: React.FC<{
  mode?: 'page' | 'dialog';
  t: T;
}> = ({ mode = 'page', t }) => {
  return (
    <CardServices
      mode={mode}
      title={t.servicesHowToRent}
      icon={Bike}
      linkLabel={t.servicesFindShop}
      linkDestination="/shops"
    >
      <CardServicesSteps
        icon={MapPin}
        label={t.servicesVisit}
        description={t.servicesNoOnlineBooking}
      />
      <CardServicesSteps
        icon={CheckCircle}
        label={t.servicesPickAVehicle}
        description={t.servicesHelpYouChose}
      />
      <CardServicesSteps
        icon={Calendar}
        label={t.servicesUseForWeeks}
        description={t.servicesFreeOfCharge}
      />
      <CardServicesSteps
        icon={LogIn}
        label={t.servicesReturn}
        description={t.servicesReturnVehicle}
      />
    </CardServices>
  );
};
export const ServicesJoinCourseView: React.FC<{
  mode?: 'page' | 'dialog';
  t: T;
}> = ({ mode = 'page', t }) => {
  return (
    <CardServices
      mode={mode}
      title={t.servicesJoinCourse}
      icon={User}
      linkLabel={t.servicesFindEvent}
      linkDestination="/stories"
    >
      <CardServicesSteps
        icon={BookOpen}
        label={t.servicesViewCourses}
        description={t.servicesViewWhatsRight}
      />
      <CardServicesSteps
        icon={ClipboardCheck}
        label={t.servicesRegisterForEvent}
        description={t.servicesSignUpOnline}
      />
      <CardServicesSteps
        icon={Mail}
        label={t.servicesCheckInbox}
        description={t.servicesConfirmationMail}
      />
      <CardServicesSteps
        icon={MapPin}
        label={t.servicesShowUpAndJoin}
        description={t.servicesComeAtScheduledTime}
      />
    </CardServices>
  );
};

export default function Services() {
  const { data } = usePreloadedDataLocalized();
  const t = data.generalContent;
  return (
    <Page heading={t.servicesTitle} variant="muted">
      <Section variant="muted">
        <SectionContent>
          <div
            className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2
              xl:grid-cols-3"
          >
            <ServicesRepairCardView t={t} />
            <ServicesHowToRentView t={t} />
            <ServicesJoinCourseView t={t} />
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
