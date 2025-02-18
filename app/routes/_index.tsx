import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Online Store Sample" },
    { name: "description", content: "Online Store Sample" },
  ];
}

export default function Home() {
  return <Welcome />;
}
