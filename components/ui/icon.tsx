import { SVGProps } from "react"
import { Icons, IconName } from "@/lib/icons"
import { cn } from "@/lib/utils"

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  className?: string
}

export function Icon({ name, className, ...props }: IconProps) {
  const IconComponent = Icons[name]
  
  return (
    <IconComponent
      className={cn("w-4 h-4", className)}
      {...props}
    />
  )
} 