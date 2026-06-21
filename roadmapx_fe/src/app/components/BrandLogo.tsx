import { cn } from "@/lib/utils";
import logoSrc from "../../../Images/RoadMapX.png";

type BrandLogoProps = {
  className?: string;
};

export default function BrandLogo({ className }: BrandLogoProps) {
  return (
    <img
      src={logoSrc}
      alt="RoadMapX"
      className={cn("h-10 w-auto rounded-xl object-contain", className)}
    />
  );
}
