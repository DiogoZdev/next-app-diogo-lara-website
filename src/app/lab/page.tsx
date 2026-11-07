import { LabList } from "@/components/Lab/LabList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Browser instruments and other experiments.",
};

export default function LabPage() {
  return <LabList />;
}
