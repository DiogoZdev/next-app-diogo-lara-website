import { Mascot } from "@/components/Mascot";
import { MascotFieldNotes } from "@/components/Mascot/FieldNotes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mascot",
  description:
    "Meet Lester, the ugly rat mascot living on Diogo Lara's site. Drop food on him, watch his eyes follow your cursor, and try not to wake him.",
};

export default function MascotPage() {
  return (
    <>
      <Mascot />
      <MascotFieldNotes />
    </>
  );
}
