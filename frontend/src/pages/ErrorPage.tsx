import { Button } from "@/components/ui/button";

export function ErrorPage({ code }: { code: number }) {
  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 mb-10 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
          {code == 404
            ? "Page not found"
            : code >= 500
              ? "Error"
              : "Unexpect error occurred"}
        </h1>

        {code >= 500 && <p>Can't connect to server</p>}
        <div className="flex items-center justify-center gap-x-6">
          <Button>
            <a href="/"> {code >= 500 ? "Try again" : "Go back home"}</a>
          </Button>
        </div>
      </div>
    </main>
  );
}
