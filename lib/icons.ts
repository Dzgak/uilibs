import { OpenSourceIcon } from "./icons/open-source"
import { PaidIcon } from "./icons/paid"

export const Icons = {
  OpenSource: OpenSourceIcon,
  Paid: PaidIcon
} as const

export type IconName = keyof typeof Icons
