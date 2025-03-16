import PersonalInformationForm from "@/components/personal-information-form";

import { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PersonalInformationForm />
    </Suspense>
  );
}

export default page;
