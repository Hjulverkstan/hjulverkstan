import { Link } from '@components/shadcn/Button';

export function FooterText() {
  return (
    <div
      className="flex flex-col items-center gap-4 text-sm text-gray-600
        md:flex-row md:gap-6 md:text-base"
    >
      <div className="flex items-center gap-2">
        <span>initiative by</span>
        <Link
          to="https://www.savethechildren.net"
          target="_blank"
          variant="link"
          className="flex items-center gap-1 font-semibold text-gray-700
            hover:underline"
        >
          <img src="/stc.svg" alt="Save the Children" className="h-4 w-auto" />
          <span>Save the Children</span>
        </Link>
      </div>

      <div className="hidden h-4 border-l border-gray-300 md:block" />

      <div className="flex items-center gap-2">
        <span>development by</span>
        <Link
          to="https://www.alten.se"
          target="_blank"
          variant="link"
          className="flex items-center gap-1 font-semibold text-gray-700
            hover:underline"
        >
          <img src="/alten.svg" alt="ALTEN Sweden" className="h-4 w-auto" />
          <span>ALTEN Sweden</span>
        </Link>
      </div>

      <div className="hidden h-4 border-l border-gray-300 md:block" />

      <div className="flex items-center gap-2">
        <span>open source on</span>
        <Link
          to="https://github.com"
          target="_blank"
          variant="link"
          className="flex items-center gap-1 font-semibold text-gray-700
            hover:underline"
        >
          <img src="/github.svg" alt="GitHub" className="h-4 w-auto" />
          <span>GitHub</span>
        </Link>
      </div>
    </div>
  );
}
