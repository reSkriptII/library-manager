import { Button } from "#root/components/ui/button.tsx";

export function Hero() {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 border-b bg-[url('herobackground.webp')] bg-cover">
      <div className="container mx-auto px-8 py-12">
        <h1 className="mb-8 text-2xl">
          Welcome to <span className="text-3xl font-bold">The Library</span>
        </h1>
        <Button>Log in</Button>
      </div>
    </div>
  );
}
