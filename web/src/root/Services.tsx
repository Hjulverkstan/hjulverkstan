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

export default function Services() {
  const { data } = usePreloadedDataLocalized();

  return (
    <Page heading={data.generalContent.servicesTitle} variant="muted">
      <Section variant="muted">
        <SectionContent>
          <div
            className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2
              xl:grid-cols-3"
          >
            <CardServices
              title={data.generalContent.servicesHowToRepair}
              icon={Hammer}
              footerNote={data.generalContent.servicesFooterNote}
              linkLabel={data.generalContent.servicesFindShop}
              linkDestination="/shops"
            >
              <CardServicesSteps
                icon={MapPin}
                label={data.generalContent.servicesVisit}
                description={data.generalContent.servicesNoOnlineBooking}
              />
              <CardServicesSteps
                icon={MessageCircle}
                label={data.generalContent.servicesTellUs}
                description={data.generalContent.servicesInspectTogether}
              />
              <CardServicesSteps
                icon={Wrench}
                label={data.generalContent.servicesSimpleFix}
                description={data.generalContent.servicesDoneRightAway}
              />
              <CardServicesSteps
                icon={Calendar}
                label={data.generalContent.servicesMoreTime}
                description={data.generalContent.servicesLeaveItWithUs}
              />
              <CardServicesSteps
                icon={LogIn}
                label={data.generalContent.servicesPickItUp}
                description={data.generalContent.servicesWeWillLetYouKnow}
              />
            </CardServices>

            <CardServices
              title={data.generalContent.servicesHowToRent}
              icon={Bike}
              linkLabel={data.generalContent.servicesFindShop}
              linkDestination="/shops"
            >
              <CardServicesSteps
                icon={MapPin}
                label={data.generalContent.servicesVisit}
                description={data.generalContent.servicesNoOnlineBooking}
              />
              <CardServicesSteps
                icon={CheckCircle}
                label={data.generalContent.servicesPickAVehicle}
                description={data.generalContent.servicesHelpYouChose}
              />
              <CardServicesSteps
                icon={Calendar}
                label={data.generalContent.servicesUseForWeeks}
                description={data.generalContent.servicesFreeOfCharge}
              />
              <CardServicesSteps
                icon={LogIn}
                label={data.generalContent.servicesReturn}
                description={data.generalContent.servicesReturnVehicle}
              />
            </CardServices>

            <CardServices
              title={data.generalContent.servicesJoinCourse}
              icon={User}
              linkLabel={data.generalContent.servicesFindEvent}
              linkDestination="/stories"
            >
              <CardServicesSteps
                icon={BookOpen}
                label={data.generalContent.servicesViewCourses}
                description={data.generalContent.servicesViewWhatsRight}
              />
              <CardServicesSteps
                icon={ClipboardCheck}
                label={data.generalContent.servicesRegisterForEvent}
                description={data.generalContent.servicesSignUpOnline}
              />
              <CardServicesSteps
                icon={Mail}
                label={data.generalContent.servicesCheckInbox}
                description={data.generalContent.servicesConfirmationMail}
              />
              <CardServicesSteps
                icon={MapPin}
                label={data.generalContent.servicesShowUpAndJoin}
                description={data.generalContent.servicesComeAtScheduledTime}
              />
            </CardServices>
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
