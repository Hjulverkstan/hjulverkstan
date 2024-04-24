export default function About() {
  return (
    <div className="bg-muted h-full flex-col p-10 lg:flex">
      <div className="grow" />
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg">This site in under alpha production</p>
          <footer className="text-sm">Dev Team</footer>
        </blockquote>
      </div>
    </div>
  );
}
