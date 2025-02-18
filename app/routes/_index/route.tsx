import { Welcome } from "~/routes/_index/welcome";
import type { Route } from "./+types/route";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Online Store Sample" },
    { name: "description", content: "Online Store Sample" },
  ];
}

export default function Home() {
  return <Welcome />;
}
