import { Base, Body } from '@components/Card';
interface InfoCardProps {
  bodyBold?: string;
  bodyRegular?: string;
}
export const InfoCard = ({ bodyBold, bodyRegular }: InfoCardProps) => {
  return (
    <Base variant="yellow" className="w-fit border border-yellow-pale">
      <Body className="flex flex-col items-center gap-4 lg:flex-row">
        <span aria-label="waving hand" className="text-2xl">
          &#128075;
        </span>
        <span>
          <strong>{bodyBold}</strong> {bodyRegular}
        </span>
      </Body>
    </Base>
  );
};
