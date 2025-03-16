import EmailForm from "@/components/email-form";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailForm />;
    </Suspense>
  );
}
