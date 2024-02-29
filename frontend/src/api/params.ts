// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SomeParams {}

export interface PlayerGameStatsV2Params {
  game_season?: string
  dates?: string
  game_ids?: string
  time_query?: 'last_3' | 'last_5' | 'last_10' | 'current_season'
  limit?: number
  before_date?: null | string
}

export interface TeamGameStatsV2Params {
  game_season: string
  dates?: string
  game_ids?: string
  strengths?: string
  periods?: string
  time_query?: 'last_3' | 'last_5' | 'last_10' | 'current_season'
}

export interface UpdatePlaylistSharingPolicyPayload {
  policies: {
    // role: Models.PolicyRole | null
    // principalType: Models.PrincipalType
    principalId: string
  }[]
  message?: string
  notifyPeople?: boolean
}

export interface UpdateOrganizationMemberRights {
  memberId: string
  add: string[]
  remove: string[]
}
