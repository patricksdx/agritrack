import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/modeToggle";

export default function Home() {
  return (
    <div>
      <ModeToggle />
      <h1>Bienvenido</h1>
      <Button>Click me</Button>
    </div>
  );
}
