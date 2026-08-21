"use client";

import { useSyncExternalStore } from "react";
import { CONTACT_REGION_COOKIE, regionalContacts, type ContactRegion } from "@/lib/regional-contacts";

const subscribe = () => () => undefined;
const getServerSnapshot = (): ContactRegion => "international";

function getSnapshot(): ContactRegion {
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${CONTACT_REGION_COOKIE}=`))
    ?.split("=")[1];
  return value === "ru" ? "ru" : "international";
}

export function useRegionalContacts() {
  return regionalContacts[useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)];
}
