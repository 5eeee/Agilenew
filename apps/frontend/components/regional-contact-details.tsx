"use client";

import { useRegionalContacts } from "@/components/use-regional-contacts";

export function RegionalEmail() {
  const contacts = useRegionalContacts();
  return <a href={`mailto:${contacts.email}`}>{contacts.email}</a>;
}

export function RegionalContactDetails() {
  const contacts = useRegionalContacts();
  return <>{contacts.email}<br />{contacts.phoneDisplay}</>;
}
