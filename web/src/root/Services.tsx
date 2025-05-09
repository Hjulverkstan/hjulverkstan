import { Page } from '@components/Page';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import {
  BikeIcon,
  BookOpenIcon,
  Calendar,
  CheckCircleIcon,
  ClipboardCheck,
  HammerIcon,
  LogIn,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  User,
  Wrench,
} from 'lucide-react';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { CardServices } from '@components/CardServices';

export default function Services() {
  const { data } = usePreloadedDataLocalized();

  const repairServices = {
    icon: HammerIcon,
    title: data.generalContent.servicesHowToRepair,
    steps: [
      {
        icon: MapPinIcon,
        label: data.generalContent.servicesVisit,
        description: data.generalContent.servicesNoOnlineBooking,
      },
      {
        icon: MessageCircleIcon,
        label: data.generalContent.servicesTellUs,
        description: data.generalContent.servicesInspectTogether,
      },
      {
        icon: Wrench,
        label: data.generalContent.servicesSimpleFix,
        description: data.generalContent.servicesDoneRightAway,
      },
      {
        icon: Calendar,
        label: data.generalContent.servicesMoreTime,
        description: data.generalContent.servicesLeaveItWithUs,
      },
      {
        icon: LogIn,
        label: data.generalContent.servicesPickItUp,
        description: data.generalContent.servicesWeWillLetYouKnow,
      },
    ],
    footerNote: data.generalContent.servicesFooterNote,
    cta: {
      label: data.generalContent.servicesFindShop,
      link: '/shops',
    },
  };

  const rentServices = {
    icon: BikeIcon,
    title: data.generalContent.servicesHowToRent,
    steps: [
      {
        icon: MapPinIcon,
        label: data.generalContent.servicesVisit,
        description: data.generalContent.servicesNoOnlineBooking,
      },
      {
        icon: CheckCircleIcon,
        label: data.generalContent.servicesPickAVehicle,
        description: data.generalContent.servicesHelpYouChose,
      },
      {
        icon: Calendar,
        label: data.generalContent.servicesUseForWeeks,
        description: data.generalContent.servicesFreeOfCharge,
      },
      {
        icon: LogIn,
        label: data.generalContent.servicesReturn,
        description: data.generalContent.servicesReturnVehicle,
      },
    ],
    cta: {
      label: data.generalContent.servicesFindShop,
      link: '/shops',
    },
  };

  const courseServices = {
    icon: User,
    title: data.generalContent.servicesJoinCourse,
    steps: [
      {
        icon: BookOpenIcon,
        label: data.generalContent.servicesViewCourses,
        description: data.generalContent.servicesViewWhatsRight,
      },
      {
        icon: ClipboardCheck,
        label: data.generalContent.servicesRegisterForEvent,
        description: data.generalContent.servicesSignUpOnline,
      },
      {
        icon: MailIcon,
        label: data.generalContent.servicesCheckInbox,
        description: data.generalContent.servicesConfirmationMail,
      },
      {
        icon: MapPinIcon,
        label: data.generalContent.servicesShowUpAndJoin,
        description: data.generalContent.servicesComeAtScheduledTime,
      },
    ],
    cta: {
      label: data.generalContent.servicesFindEvent,
      link: '/stories',
    },
  };

  return (
    <Page heading="Services" variant="muted">
      <Section variant="muted" className="pt-0">
        <SectionContent className="space-y-6">
          <div
            className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2
              xl:grid-cols-3"
          >
            <CardServices services={repairServices} />
            <CardServices services={rentServices} />
            <CardServices services={courseServices} />
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
