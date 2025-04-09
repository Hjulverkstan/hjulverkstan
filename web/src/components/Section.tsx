import { cva, VariantProps } from 'class-variance-authority';

const sectionStyles = cva('px-4 py-8 md:px-[140px] md:py-[140px]', {
  variants: {
    variant: {
      gray: 'bg-[#F7F7F7]',
      white: 'bg-white',
    },
  },
  defaultVariants: {
    variant: 'white',
  },
});

type SectionProps = VariantProps<typeof sectionStyles> & {
  children: React.ReactNode;
};

export const Section = ({ variant, children }: SectionProps) => {
  return (
    <section className={sectionStyles({ variant })}>
      <div className="w-full max-w-full">{children}</div>
    </section>
  );
};
