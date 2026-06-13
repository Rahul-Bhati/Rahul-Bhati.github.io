import type { ComponentType, SVGProps } from "react";
import { Code2, Hexagon, Briefcase, MapPin, Sparkles, Link2 } from "lucide-react";
import {
  MailIcon,
  XIcon,
  InstagramIcon,
  LinkedinIcon,
  GithubIcon,
  MediumIcon,
  YoutubeSolidIcon,
} from "@/components/icons";

export type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number }
>;

/**
 * Maps a stored `platform` string (DB SiteLink / CrossPost) to an icon component.
 * Lets links/cross-posts be fully DB-driven while icons stay in code.
 */
const REGISTRY: Record<string, IconComponent> = {
  // Brand / social
  email: MailIcon,
  x: XIcon,
  twitter: XIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  medium: MediumIcon,
  youtube: YoutubeSolidIcon,
  // Hero pill glyphs (lucide)
  code: Code2,
  hexagon: Hexagon,
  briefcase: Briefcase,
  mappin: MapPin,
  sparkles: Sparkles,
};

export function iconFor(platform: string): IconComponent {
  return REGISTRY[platform.toLowerCase()] ?? Link2;
}
