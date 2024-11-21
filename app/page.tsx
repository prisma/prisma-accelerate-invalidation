import { InvalidationTestButton } from "@/components/Quote/InvalidationTestButton";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 md:p-18">
      <InvalidationTestButton />
    </main>
  );
}
