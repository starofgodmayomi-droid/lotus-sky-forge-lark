import { createFileRoute } from "@tanstack/react-router";
import { OmnicosConsole } from "@/components/omnicos/console";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <OmnicosConsole />;
}
