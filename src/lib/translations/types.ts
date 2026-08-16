export type Lang = "en" | "pt";

export interface TimelineItemData {
  title: string;
  period: string;
  type: "professional" | "education";
  institution: string;
  details: string[];
}
