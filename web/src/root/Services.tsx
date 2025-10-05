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
    <Page heading={data.text.servicesTitle} variant="muted">
      <Section variant="muted">
        <SectionContent>
          <div
            className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2
              xl:grid-cols-3"
          >
            <CardServices
              title={data.text.servicesHowToRepair}
              icon={Hammer}
              footerNote={data.text.servicesFooterNote}
              linkLabel={data.text.servicesFindShop}
              linkDestination="/shops"
            >
              <CardServicesSteps
                icon={MapPin}
                label={data.text.servicesVisit}
                description={data.text.servicesNoOnlineBooking}
              />
              <CardServicesSteps
                icon={MessageCircle}
                label={data.text.servicesTellUs}
                description={data.text.servicesInspectTogether}
              />
              <CardServicesSteps
                icon={Wrench}
                label={data.text.servicesSimpleFix}
                description={data.text.servicesDoneRightAway}
              />
              <CardServicesSteps
                icon={Calendar}
                label={data.text.servicesMoreTime}
                description={data.text.servicesLeaveItWithUs}
              />
              <CardServicesSteps
                icon={LogIn}
                label={data.text.servicesPickItUp}
                description={data.text.servicesWeWillLetYouKnow}
              />
            </CardServices>

            <CardServices
              title={data.text.servicesHowToRent}
              icon={Bike}
              linkLabel={data.text.servicesFindShop}
              linkDestination="/shops"
            >
              <CardServicesSteps
                icon={MapPin}
                label={data.text.servicesVisit}
                description={data.text.servicesNoOnlineBooking}
              />
              <CardServicesSteps
                icon={CheckCircle}
                label={data.text.servicesPickAVehicle}
                description={data.text.servicesHelpYouChose}
              />
              <CardServicesSteps
                icon={Calendar}
                label={data.text.servicesUseForWeeks}
                description={data.text.servicesFreeOfCharge}
              />
              <CardServicesSteps
                icon={LogIn}
                label={data.text.servicesReturn}
                description={data.text.servicesReturnVehicle}
              />
            </CardServices>

            <CardServices
              title={data.text.servicesJoinCourse}
              icon={User}
              linkLabel={data.text.servicesFindEvent}
              linkDestination="/stories"
            >
              <CardServicesSteps
                icon={BookOpen}
                label={data.text.servicesViewCourses}
                description={data.text.servicesViewWhatsRight}
              />
              <CardServicesSteps
                icon={ClipboardCheck}
                label={data.text.servicesRegisterForEvent}
                description={data.text.servicesSignUpOnline}
              />
              <CardServicesSteps
                icon={Mail}
                label={data.text.servicesCheckInbox}
                description={data.text.servicesConfirmationMail}
              />
              <CardServicesSteps
                icon={MapPin}
                label={data.text.servicesShowUpAndJoin}
                description={data.text.servicesComeAtScheduledTime}
              />
            </CardServices>
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
