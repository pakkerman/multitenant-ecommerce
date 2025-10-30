import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-12 mt-32">
      <div className="">
        <Button variant="elevated">I'm a button</Button>
      </div>
      <div className="">
        <Input placeholder="I'm an input" />
      </div>

      <div className="">
        <Progress value={50} />
      </div>

      <div className="">
        <Textarea placeholder="I'm a textarea" />
      </div>
      <div className="">
        <Checkbox />
      </div>
    </div>
  );
}
