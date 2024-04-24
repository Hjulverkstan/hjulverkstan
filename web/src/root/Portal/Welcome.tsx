export default function Welcome() {
  return (
    <div
      className="flex h-full w-full flex-col justify-center space-y-2
        text-center"
    >
      <h1 className="text-2xl font-semibold tracking-tight">
        Welcome to the Admin!
      </h1>
      <p className="text-muted-foreground text-sm">This is a secure area</p>
    </div>
  );
}
