import { Intent } from "@blueprintjs/core";
import { TUser } from '../../../backend/src/types/user'


export const ROLE_INTENTS_MAP: Record<TUser['role'], Intent> = {
  admin: Intent.PRIMARY,
  director: Intent.SUCCESS,
  manager: Intent.WARNING,
}