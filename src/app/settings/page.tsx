import type { Metadata } from "next";
import SettingsScreen from "@/screens/settings/SettingsScreen";
import { strings } from "@/strings";

export const metadata: Metadata = {
  title: `${strings.settings.title} — ${strings.app.name}`,
};

export default function SettingsPage() {
  return <SettingsScreen />;
}
