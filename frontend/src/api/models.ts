// import * as DrawingTypes from '@sportcontract/core/src/drawing/types'
// import {Patch} from 'immer'
// import * as DatahubModels from '../datahub-api/models'
// export {EventTypes} from '../datahub-api/models'

// export type GamehubGameReport = DatahubModels.GamehubGameReport
// export type GamehubMatchedGame = DatahubModels.GamehubMatchedGame
// export type GamehubGameClock = DatahubModels.GamehubGameClock
// export type SearchResultPlayer = DatahubModels.SearchResultPlayer
// export type SearchResultTeam = DatahubModels.SearchResultTeam
// export type SearchResultLeague = DatahubModels.SearchResultLeague
// export type SearchResultUser = DatahubModels.SearchResultUser
// export type PolymorphicEvent = DatahubModels.PolymorphicEvent
// export type PlaceholderEvent = DatahubModels.PlaceholderEvent
// export type TeamClass = DatahubModels.TeamClass
// export type SCPolymorphicEvent = DatahubModels.SCPolymorphicEvent

export type F = {

}

// export interface User {
//   _id: string
//   email: string
//   profile: {
//     _id: string
//     type: string
//     firstName: string
//     lastName: string
//   }
//   permissions: {
//     [ctx: string]: {
//       [key: string]: string[]
//     }
//   }
//   allPermissions: {
//     [ctx: string]: {
//       [key: string]: string[]
//     }
//   }
//   roles: {
//     context: string
//     roles: {
//       name: string
//       display: string
//     }[]
//   }[]
//   account?: UserAccount
//   accounts?: UserAccount[]
//   subscription: null | {_id: string}
// }

// export interface UserAccount {
//   _id: string
//   display: string
//   functions: string[]
//   type: 'user' | 'team' | 'player' | 'company'
//   isPlayer: boolean
//   roles: {
//     name: string
//     display: string
//   }[]
// }

// export interface ContactGroup<ID = string> {
//   _id: ID
//   name: string
//   organization: {_id: ID; type: string}
//   members: Array<{_id: ID; type: 'user'; display: string}>
//   createdBy: {
//     userId: ID
//     profileId: ID
//     profileType: string
//     firstName: string
//     lastName: string
//     imageUrl: string
//   }
// }

// export interface ContactGroupPublic {
//   _id: string
//   name: string
//   membersCount: number
// }

// export interface VideoUsage {
//   used: number
//   downloaded: number
//   allow: number
//   canDownload: boolean
//   watchToken: string
// }

// export interface Game<ID = string> {
//   _id: ID
//   id: ID
//   gameId: ID
//   away: Team
//   home: Team
//   league: {
//     name: string
//     _id: ID
//   }
//   date: string
//   scores: string
//   score_home: string
//   score_away: string
//   season: string
//   movie_urls: string[]
//   game_clock_published: boolean
//   gameType?: string
// }

// export interface GameReport {
//   id: string
//   away: ReportTeam
//   home: ReportTeam
//   events: GameEventType[]
// }

// export interface Team<ID = string> {
//   _id: ID
//   allImageUrls: string[]
//   imageUrl: string
//   name: string
//   scName: string
//   scId: string
//   league: {
//     name: string
//     _id: ID
//   }
// }

// export interface PlayerStat {
//   id: number
//   league: {
//     _id: string
//     name: string
//   }
//   jerseyNumber: number
//   team: {
//     _id: string
//     name: string
//   }
//   season: {
//     startYear: number
//   }
// }

// export interface SeasonalTeamLeague {
//   league: League
//   team: {
//     _id: string
//     name: string
//   }
// }
// export interface PlayerSeasonalTeamLeague extends SeasonalTeamLeague {
//   jerseyNumber: number
//   season: string
// }

// export interface Player<ID = string> {
//   _id: ID
//   firstName: string
//   lastName: string
//   allImageUrls: string[]
//   imageUrl: string
//   latestPlayerStats: PlayerStat
//   effectiveSeasonPlayerStats: PlayerStat[]
//   playerPosition: string
// }

// export interface League<ID = string> {
//   association?: {
//     level: number
//   }
//   _id: ID
//   name: string
//   teamType: string
//   country: {
//     _id: ID
//     name: string
//   }
//   slug: string
// }

// export interface ReportTeam<ID = string> {
//   id: string
//   scId: ID
//   name: string
//   scName: string
// }

// export interface BaseGameEvent {
//   dataSource: string
//   scHidden: boolean
// }

// type GameEventType = MissedShotGameEvent

// export interface MissedShotGameEvent extends BaseGameEvent {
//   type: 'missed_shot'
//   teamId: number
// }

// export type LeagueSeasonSummaryStatValue = {
//   min: number
//   max: number
//   avg: number
// }

// export type PeriodKey = 'all' | 'p1' | 'p2' | 'p3' | 'ot'
// export type StrengthKey = 'strength_5x5' | 'strength_5x4' | 'strength_4x5' | 'strength_other'

// export type SeasonStatKey =
//   | 'G_For'
//   | 'G_Against'
//   | 'AS_For'
//   | 'AS_Against'
//   | 'XG_AS_For'
//   | 'XG_AS_Against'
//   | 'G_For_Per60'
//   | 'G_Against_Per60'
//   | 'AS_For_Per60'
//   | 'AS_Against_Per60'
//   | 'XG_AS_For_Per60'
//   | 'XG_AS_Against_Per60'
//   | 'TimeOfPossessionOZTotal'
//   | 'TimeOfPossessionOZPerGame'
//   | 'OppTimeOfPossessionOZTotal'
//   | 'OppTimeOfPossessionOZPerGame'
//   | 'ZoneEntries'
//   | 'ZoneEntriesWithPossession'
//   | 'ZoneEntriesWithPossessionPctg'
//   | 'OppZoneEntries'
//   | 'OppZoneEntriesWithPossession'
//   | 'OppZoneEntriesWithPossessionPctg'
//   | 'ZoneExits'
//   | 'ZoneExitsWithPossession'
//   | 'ZoneExitsWithPossessionPctg'
//   | 'OppZoneExits'
//   | 'OppZoneExitsWithPossession'
//   | 'OppZoneExitsWithPossessionPctg'
//   | 'ShotsInEntry'
//   | 'ShotsPerEntry'
//   | 'XGInEntry'
//   | 'XGPerEntry'
//   | 'OppShotsInEntry'
//   | 'OppShotsPerEntry'
//   | 'OppXGInEntry'
//   | 'OppXGPerEntry'
//   | 'Recovery'
//   | 'OZRecovery'
//   | 'NZRecovery'
//   | 'DZRecovery'
//   | 'OppRecovery'
//   | 'OppOZRecovery'
//   | 'OppNZRecovery'
//   | 'OppDZRecovery'
//   | 'RecoveryRate'
//   | 'OZRecoveryRate'
//   | 'NZRecoveryRate'
//   | 'DZRecoveryRate'
//   | 'IceTime'
//   | 'PassesToSlot'
//   | 'PassesToSlot_Per60'
//   | 'OZFOW'
//   | 'OZFOL'
//   | 'DZFOW'
//   | 'DZFOL'
//   | 'ShotsForInOZFOW'
//   | 'ShotsForInDZFOW'
//   | 'ShotsAgainstInOZFOL'
//   | 'ShotsAgainstInDZFOL'
//   | 'XGForInOZFOW'
//   | 'XGForInDZFOW'
//   | 'XGAgainstInOZFOL'
//   | 'XGAgainstInDZFOL'
//   | 'ShotsForOZFOW_Per60'
//   | 'ShotsForDZFOW_Per60'
//   | 'ShotsAgainstOZFOL_Per60'
//   | 'ShotsAgainstDZFOL_Per60'
//   | 'XGForOZFOW_Per60'
//   | 'XGForDZFOW_Per60'
//   | 'XGAgainstOZFOL_Per60'
//   | 'XGAgainstDZFOL_Per60'

// type TeamSeasonStatBase = {
//   [strength in StrengthKey]: {
//     teamStat: {
//       [statKey in SeasonStatKey]?: number | null
//     }
//   }
// }

// type LeagueSeasonStatBase = {
//   [statKey in SeasonStatKey]: LeagueSeasonSummaryStatValue
// }

// type LeaguePlayerSeasonStatBase = {
//   [statKey in PlayerStatKey]: LeagueSeasonSummaryStatValue
// }

// type PlayerSeasonStatBase = {
//   [strength in StrengthKey]: {
//     playerStat: {
//       [statKey in PlayerStatKey]?: number | null
//     }
//   }
// }

// export interface LeagueSeasonSummaryStat extends LeagueSeasonStatBase {
//   _id: string
//   competition: string
//   competitionName: string
//   season: string
// }

// export interface LeaguePlayerSeasonSummaryStat extends LeaguePlayerSeasonStatBase {
//   _id: string
//   competition: string
//   competitionName: string
//   season: string
// }

// export interface TeamSeasonSummaryStat extends TeamSeasonStatBase {
//   _id: string
//   competition: string
//   competitionName: string
//   gameCount: number
//   season: string
//   team: string
//   teamName: string
//   teamStat: {
//     [statKey in SeasonStatKey]?: number
//   }
//   period: PeriodKey
// }
// interface PlayerStatBySeasonSummaryStat extends PlayerStatBase {
//   events?: {
//     [key in PlayerStatKey]: string[]
//   }
// }

// export interface PlayerSeasonSummaryStat extends PlayerSeasonStatBase {
//   _id: string
//   competition: string
//   competitionName: string
//   gameCount: number
//   season: string
//   jerseyNumber: string
//   player: string
//   playerName: string
//   position: string
//   playerStat: PlayerStatBySeasonSummaryStat
//   period: PeriodKey
// }

// export type TeamStatKeys =
//   | 'AS'
//   | 'XG_ESAS'
//   | 'XG_PPAS'
//   | 'XG_AS'
//   | 'G'
//   | 'SOG'
//   | 'MS'
//   | 'BkS'
//   | 'PS'
//   | 'PS_Success'
//   | 'PS_Failure'
//   | 'HPSA'
//   | 'HPSA_OnGoal'
//   | 'ESSOG'
//   | 'TimeOfPossession'
//   | 'TimeOfPossessionOZ'
//   | 'ES_DMP_IN'
//   | 'ZoneEntriesWithPossession'
//   | 'ZoneEntriesWithPossessionPctg'
//   | 'ZoneExitsWithPossession'
//   | 'ZoneExitsWithPossessionPctg'
//   | 'ShotsPerEntry'
//   | 'OddManRushes'
//   | 'PPOddManRushes'
//   | 'SetBreakouts'
//   | 'PPSetBreakouts'
//   | 'DZRecoveryRate'
//   | 'NZRecoveryRate'
//   | 'OZRecoveryRate'
//   | 'DZRecovery'
//   | 'NZRecovery'
//   | 'OZRecovery'
//   | 'ES_REC'
//   | 'PPG'
//   | 'ESG'
//   | 'SHG'
//   | 'PPTimeOfPossessionOZ'
//   | 'ES'
//   | 'FO_tot'
//   | 'FOW'
//   | 'FOL'
//   | 'PP'
//   | 'SH'
//   | 'ZoneEntries'
//   | 'ZoneExits'
//   | 'OnIceTimeDZ'
//   | 'OnIceTimeNZ'
//   | 'OnIceTimeOZ'
//   | 'OnIceOppTimeDZ'
//   | 'OnIceOppTimeNZ'
//   | 'OnIceOppTimeOZ'
//   | 'OnIcePossessionTimeDZ'
//   | 'OnIcePossessionTimeNZ'
//   | 'OnIcePossessionTimeOZ'
//   | 'OnIceOppPossessionTimeDZ'
//   | 'OnIceOppPossessionTimeNZ'
//   | 'OnIceOppPossessionTimeOZ'
//   | 'PossessionWonDZ'
//   | 'PossessionWonNZ'
//   | 'PossessionWonOZ'
//   | 'PossessionLostDZ'
//   | 'PossessionLostNZ'
//   | 'PossessionLostOZ'

// type TeamStatBase = {
//   [key in TeamStatKeys]: number | null
// }

// export interface DetailTeamStat extends TeamStatBase {
//   fullName: string
//   id: number
//   scId: string
//   scName: string
//   code: string
//   events: {
//     [key in TeamStatKeys]: string[]
//   }
// }

// export interface TeamGameStat {
//   _id: string
//   id: string
//   gameId: string
//   home: ReportTeam & {_id: string; imageUrl: string}
//   away: ReportTeam & {_id: string; imageUrl: string}
//   date: string
//   midCompetition: string
//   isAdvancedStatEnabled: boolean
//   teamStat: DetailTeamStat
//   players: DatahubModels.GamehubGameReportPlayer[]
//   isVideoArchived: boolean
//   isVideoAvailable: boolean
//   gameClockSynced: boolean
//   strength_3x3: {teamStat: DetailTeamStat; opponentTeamStat: DetailTeamStat}
//   strength_3x4: {teamStat: DetailTeamStat; opponentTeamStat: DetailTeamStat}
//   strength_3x5: {teamStat: DetailTeamStat; opponentTeamStat: DetailTeamStat}
//   strength_4x3: {teamStat: DetailTeamStat; opponentTeamStat: DetailTeamStat}
//   strength_4x4: {teamStat: DetailTeamStat; opponentTeamStat: DetailTeamStat}
//   strength_4x5: {teamStat: DetailTeamStat; opponentTeamStat: DetailTeamStat}
//   strength_5x3: {teamStat: DetailTeamStat; opponentTeamStat: DetailTeamStat}
//   strength_5x4: {teamStat: DetailTeamStat; opponentTeamStat: DetailTeamStat}
//   strength_5x5: {teamStat: DetailTeamStat; opponentTeamStat: DetailTeamStat}
//   strength_other: {teamStat: DetailTeamStat}
//   opponentTeamStat: DetailTeamStat
//   teamAvailableStrengths: string[]
//   opponentAvailableStrengths: string[]
//   scTeamSides?: {
//     period: number
//     side: DatahubModels.TeamSides
//   }[]
//   scIsMirrored?: boolean
//   season: string
//   score_home: string
//   score_away: string
//   scores: string
//   isVideoRestricted: boolean
// }

// // Type for raw TeamStat where we have event store for all events and reference by their id in each fields
// export type SkaterStatKey =
//   | 'A'
//   | 'PS'
//   | 'AS'
//   | 'XG_AS'
//   | 'BkS'
//   | 'AB'
//   | 'ESG'
//   | 'ESTOI'
//   | 'FOL'
//   | 'FOW'
//   | 'FO_perc'
//   | 'FO_tot'
//   | 'G'
//   | 'Hits'
//   | 'MS'
//   | 'NEP'
//   | 'NetPlusMinus'
//   | 'NumPen'
//   | 'PIM'
//   | 'POP'
//   | 'PPAS'
//   | 'PPG'
//   | 'PPSOG'
//   | 'PPTOI'
//   | 'SHAS'
//   | 'SHG'
//   | 'SHSOG'
//   | 'SHTOI'
//   | 'SOG'
//   | 'TA' // takeaways
//   | 'GA' // giveaways
//   | 'TOI'
//   | 'TP'
//   | 'PassPctgDZ'
//   | 'PassPctgNZ'
//   | 'PassPctgOZ'
//   | 'PassPctgOverall'
//   | 'PrimaryShotAssists'
//   | 'SecondaryShotAssists'
//   | 'PrimaryShotAssistsXG'
//   | 'CorsiFor'
//   | 'CorsiAgainst'
//   | 'CorsiForPctg'
//   | 'CorsiXGFor'
//   | 'CorsiXGAgainst'
//   | 'CorsiXGForPctg'
//   | 'PassDZSuccess'
//   | 'PassDZFailed'
//   | 'PassNZSuccess'
//   | 'PassNZFailed'
//   | 'PassOZSuccess'
//   | 'PassOZFailed'
//   | 'PassDZ'
//   | 'PassNZ'
//   | 'PassOZ'
//   | 'PASS'
//   | 'SUCCESS_PASS'
//   | 'FAILED_PASS'
//   | 'BATTLE_tot'
//   | 'BATTLE_W'
//   | 'BATTLE_L'
//   | 'REC'
//   | 'CARRY'
//   | 'ENTRY_D'
//   | 'ENTRY_DPer60'
//   | 'OnIceRecovery'
//   | 'OnIceOZRecovery'
//   | 'OnIceNZRecovery'
//   | 'OnIceDZRecovery'
//   | 'OnIceRecoveryRate'
//   | 'OnIceOZRecoveryRate'
//   | 'OnIceNZRecoveryRate'
//   | 'OnIceDZRecoveryRate'
//   | 'OnIceOppRecovery'
//   | 'OnIceOZOppRecovery'
//   | 'OnIceNZOppRecovery'
//   | 'OnIceDZOppRecovery'
//   | 'ZoneEntriesWithPossession'
//   | 'ZoneEntriesWithPossessionPer60'
//   | 'ZoneExitsWithPossession'
//   | 'ZoneExitsWithPossessionPer60'
//   | 'DMP_OUT'
//   | 'DMP_IN'
//   | 'ZoneEntries'
//   | 'ZoneExits'
//   | 'RushShots'
//   | 'RushPrimaryAssists'
//   | 'RushSecondaryAssists'
//   | 'RushXGContribution'
//   | 'RushAssists'
//   | 'EntryD'
//   | 'EntryCtrlAgainst'
//   | 'DumpInsForced'
//   | 'ShotInEntryAgainst'
//   | 'OnIcePlayExtension'
//   | 'OnIcePlayExtensionTotal'
//   | 'SHF'
//   | 'gameCount'
//   // per60
//   | 'ASPer60'
//   | 'XG_ASPer60'
//   | 'BkSPer60'
//   | 'TOIPerGame'
//   | 'CorsiForPer60'
//   | 'CorsiAgainstPer60'
//   | 'CorsiForPctgPer60'
//   | 'CorsiXGForPer60'
//   | 'CorsiXGAgainstPer60'
//   | 'CorsiXGForPctgPer60'
//   | 'PrimaryShotAssistsPer60'
//   | 'SecondaryShotAssistsPer60'
//   | 'PrimaryShotAssistsXGPer60'
//   | 'PASSPer60'
//   | 'SUCCESS_PASSPer60'
//   | 'FAILED_PASSPer60'
//   | 'PassDZPer60'
//   | 'PassNZPer60'
//   | 'PassOZPer60'
//   | 'PassDZSuccessPer60'
//   | 'PassDZFailedPer60'
//   | 'PassNZSuccessPer60'
//   | 'PassNZFailedPer60'
//   | 'PassOZSuccessPer60'
//   | 'PassOZFailedPer60'
//   | 'PassPctgDZPer60'
//   | 'PassPctgNZPer60'
//   | 'PassPctgOZPer60'
//   | 'PassPctgOverallPer60'
//   | 'BATTLE_WPer60'
//   | 'BATTLE_LPer60'
//   | 'OnIceRecoveryPer60'
//   | 'OnIceOZRecoveryPer60'
//   | 'OnIceNZRecoveryPer60'
//   | 'OnIceDZRecoveryPer60'
//   | 'OnIceRecoveryRatePer60'
//   | 'OnIceOZRecoveryRatePer60'
//   | 'OnIceNZRecoveryRatePer60'
//   | 'OnIceDZRecoveryRatePer60'
//   | 'OnIceOppRecoveryPer60'
//   | 'OnIceOZOppRecoveryPer60'
//   | 'OnIceNZOppRecoveryPer60'
//   | 'OnIceDZOppRecoveryPer60'
//   | 'PassesToSlotSuccess'
//   | 'PassesToSlot'
//   | 'ZoneExitsWithPossessionContributionsPer60'
//   | 'ZoneExitsWithPossessionPer60'
//   | 'ZoneEntriesWithPossessionPer60'
//   | 'ZoneEntriesWithPossessionContributionsPer60'
//   | 'RushPrimaryAssistsPer60'
//   | 'RushXGContributionPer60'
//   | 'OnIceOppDZTurnOverRate'
//   | 'OnIcePlayExtensionRate'
//   | 'OZRecoveryPer60'
//   | 'ReboundShotsPer60'
//   | 'HPSAPer60'
//   | 'XG_ASPer60'
//   | 'ShootingPctgRelXG'
//   | 'EntryCtrlAgainstPctg'
//   | 'DumpInsForcedPctg'
//   | 'ShotsPerEntryAgainst'
//   | 'XGInEntryAgainst'
//   | 'ZoneEntriesWithPossessionPctg'
//   | 'ZoneExitsWithPossessionPctg'
//   | 'AS_DeflectionPer60'
//   | 'PassesToSlotSuccessPer60'
//   | 'XG_Average'
//   | 'OnIceOppZoneExitsWithPossessionPctg'
//   | 'PasssesToSlotPctg'
//   | 'XGPerEntryAgainst'
//   | 'HPSA_AgainstPer60'
//   | 'DumpOutPer60'
//   | 'DumpInPer60'
//   | 'ZoneExitsPer60'
//   | 'ZoneEntriesPer60'
//   | 'RushShotsPer60'
//   | 'RushAssistsPer60'
//   | 'AvgShiftTOI'
//   | 'ShiftOZStart'
//   | 'ShiftNZStart'
//   | 'ShiftDZStart'
//   | 'ShiftOnTheFlight'
//   | 'LeadingTOI'
//   | 'LeadingTOIPctg'
//   | 'TrailingTOI'
//   | 'TrailingTOIPctg'
//   | 'OnIceTimeDZ'
//   | 'OnIceTimeNZ'
//   | 'OnIceTimeOZ'
//   | 'OnIcePossessionTimeDZ'
//   | 'OnIcePossessionTimeNZ'
//   | 'OnIcePossessionTimeOZ'
//   | 'OnIceOppPossessionTimeDZ'
//   | 'OnIceOppPossessionTimeNZ'
//   | 'OnIceOppPossessionTimeOZ'
//   | 'OnIceZoneEntries'
//   | 'OnIceZoneExits'
//   | 'OnIceZoneEntries'
//   | 'OnIceOppZoneExits'
//   | 'OnIceOppZoneEntries'

// export type GoalieStatKey =
//   | 'TOI'
//   | 'TOIPerGame'
//   | 'GA'
//   | 'SVS'
//   | 'SVS_perc'
//   | 'SOGA'
//   | 'ASA'
//   | 'PSA'
//   | 'HPSA'
//   | 'HPGA'
//   | 'HPSVS_perc'
//   | 'ESGA'
//   | 'ESSVS'
//   | 'ESSVS_perc'
//   | 'ESSOGA'
//   | 'ESASA'
//   | 'ESPSA'
//   | 'PKGA'
//   | 'PKSVS'
//   | 'PKSVS_perc'
//   | 'PKSOGA'
//   | 'PKASA'
//   | 'SHGA'
//   | 'SHSVS'
//   | 'SHSVS_perc'
//   | 'SHSOGA'
//   | 'SHASA'
//   | 'SHPSA'
//   | 'Goalie_SV_pctg'
//   | 'Goalie_GSAx'
//   | 'Goalie_ReboundRate'
//   | 'Goalie_FreezeRate'
//   | 'GoaliePuckTouchesPer60'
//   | 'GoaliePassSuccessPctg'
//   | 'GoalieDumpOutSuccessPctg'
//   | 'GoaliePuckTouchesSuccessPctg'
//   | 'Goalie_dSV_pctg'
//   | 'GoalieHPSA_Against'
//   | 'GoalieHPSA_Goal'
//   | 'GoalieHPSA_SVS_pctg'

// export type PlayerStatKey = SkaterStatKey | GoalieStatKey

// export type PlayerStatBase = {
//   [key in PlayerStatKey]: number | null
// }

// export type SkaterStatBase = {
//   [key in SkaterStatKey]: number | null
// }

// export type GoalieStatBase = {
//   [key in GoalieStatKey]: number | null
// }

// export interface ExtraEventFields {
//   name?: string
//   startOffset?: number
//   endOffset?: number
//   fromSystem?: boolean // indicate event is generated by system
//   fromTagging?: boolean // indicate event comming from a user's playlist
//   recording?: boolean
// }

// /**
//  * The events rendered in the frontend sometimes being decorated with extra fields:
//  *
//  * - the raw events comming out of a `gameReport` (should not have those extra fields)
//  * - events from generated `gamestat` record
//  * - events comming from a user playlist
//  */
// export type GameEvent = PolymorphicEvent &
//   ExtraEventFields & {
//     subEvents?: GameEvent[]
//   }

// /**
//  * StatEvent is the events embedded in a system-generated stat_record for team / player with decorated information
//  */
// export type StatEvent = GameEvent & {
//   videoTime?: null | number
//   videoUrl?: null | string
//   zone?: 'dz' | 'nz' | 'oz'
//   game: {
//     home: {
//       id: string
//       scId: string
//       name: string
//       scName: string
//     }
//     away: {
//       id: string
//       scId: string
//       name: string
//       scName: string
//     }
//     date: string
//     midCompetition: string
//   }
//   team: {
//     _id: string
//     id: string
//     scId: string
//     name: string
//     scName: string
//   }
//   // ATTENTION: player can be null, even with some events like shots
//   player: DatahubModels.GamehubGameReportPlayer | null
//   extra: {
//     winner?: DatahubModels.GamehubGameReportPlayer
//     loser?: DatahubModels.GamehubGameReportPlayer
//     blocker?: DatahubModels.GamehubGameReportPlayer
//     assist1?: DatahubModels.GamehubGameReportPlayer
//     assist2?: DatahubModels.GamehubGameReportPlayer
//     pop?: DatahubModels.GamehubGameReportPlayer[]
//     nep?: DatahubModels.GamehubGameReportPlayer[]
//     direction?: string
//   }
//   subEvents?: StatEvent[]
//   scLocationX?: number
//   scLocationY?: number
//   meta: {
//     player?: DatahubModels.GamehubGameReportPlayer
//     toPlayer?: DatahubModels.GamehubGameReportPlayer
//     home_on_ice?: DatahubModels.GamehubGameReportPlayer[]
//     away_on_ice?: DatahubModels.GamehubGameReportPlayer[]
//     home_goalie?: DatahubModels.GamehubGameReportPlayer
//     away_goalie?: DatahubModels.GamehubGameReportPlayer
//     team?: Team
//     gameId: string
//     game: {
//       home: string
//       away: string
//       date: string
//     }
//   }
//   computed: {
//     status?: string
//     isRushPass?: boolean
//     isSlotPass?: boolean
//     isStretch?: boolean
//     shot_location?: 'inner_slot' | 'outer_slot' | 'outside'
//     pMin?: Record<number, number | string | null>
//   }
// }

// interface PlayerStatWithDetails extends PlayerStatBase {
//   fullName: string
//   id: number
//   jerseyNumber: string
//   position: string
//   scId: string
//   teamScId: string
//   scName: string
//   team: number
//   events: {
//     [key in PlayerStatKey]: string[]
//   }
// }

// export interface PlayerGameStat {
//   _id: string
//   id: string
//   gameId: string
//   home: Team & {id: string}
//   away: Team & {id: string}
//   date: string
//   midCompetition: string
//   playerStat: PlayerStatWithDetails
//   strength_3x3: {playerStat: PlayerStatWithDetails}
//   strength_3x4: {playerStat: PlayerStatWithDetails}
//   strength_3x5: {playerStat: PlayerStatWithDetails}
//   strength_4x3: {playerStat: PlayerStatWithDetails}
//   strength_4x4: {playerStat: PlayerStatWithDetails}
//   strength_4x5: {playerStat: PlayerStatWithDetails}
//   strength_5x3: {playerStat: PlayerStatWithDetails}
//   strength_5x4: {playerStat: PlayerStatWithDetails}
//   strength_5x5: {playerStat: PlayerStatWithDetails}
//   strength_other: {playerStat: PlayerStatWithDetails}
//   players: DatahubModels.GamehubGameReportPlayer[]
//   isVideoArchived: boolean
//   isVideoAvailable: boolean
//   isAdvancedStatEnabled: boolean
//   gameClockSynced: boolean
//   scTeamSides?: {
//     period: number
//     side: DatahubModels.TeamSides
//   }[]
//   period: string
//   season: string
//   score_home: string
//   score_away: string
//   scores: string
//   isVideoRestricted: boolean
// }

// export interface OrganizationHierarchy<ID = string> {
//   _id: ID
//   name: string
//   parent?: ID
//   type: string
//   level?: number
// }
// export interface TeamRosterEntry<ID = string> {
//   _id: ID
//   jerseyNumber: string
//   player: {
//     _id: ID
//     firstName: string
//     lastName: string
//     playerPosition: string
//     shoots: string
//     allImageUrls: string[]
//   }
// }

// export interface OrganizationMember<ID = string> {
//   _id: ID
//   profile: {
//     firstName: string
//     lastName: string
//     imageUrl: string
//     allImageUrls?: string[]
//     playerPosition?: string
//     jerseyNumber?: number
//     latestPlayerStats?: {
//       jerseyNumber: number
//       team: {
//         _id: string
//         name: string
//       }
//     }
//   }
//   rights: string[]
//   organization: {
//     _id: ID
//     level: number
//   }
//   functions: string[]
//   roles: string[]
// }

// export interface PlayerRatingTemplate<ID = string> {
//   _id: ID
//   playerCanRate: boolean
//   ratingSchema: NumberPlayerRatingSchema | PlusMinusPlayerRatingSchema
// }

// export interface NumberPlayerRatingSchema {
//   type: 'number'
//   values: number[]
// }
// export interface PlusMinusPlayerRatingSchema {
//   type: 'plus_minus'
//   values: string[]
// }

// type PlusMinusRatingValue = '-' | '0' | '+'
// export interface PlayerRatingRecordsPayload<ID = string> {
//   templateId: ID
//   game: {
//     home: {
//       _id: ID
//       name: string
//     }
//     away: {
//       _id: ID
//       name: string
//     }
//     date: string
//   }
//   line?: string
//   ratingValue?: {type: 'number'; value: number} | {type: 'plus_minus'; value: string}
//   comment?: string
//   player: {
//     _id: string
//     firstName: string
//     lastName: string
//   }
// }

// export interface GameRatingRecord<ID = string> {
//   game: {
//     home: {
//       _id: ID
//       name: string
//     }
//     away: {
//       _id: ID
//       name: string
//     }
//     date: string
//   }
//   lines?: {player: {_id: ID; firstName: string; lastName: string}; value?: string}[]
//   ratings: {
//     rater: {_id: ID; firstName: string; lastName: string}
//     ratingValues: {
//       player: {
//         _id: ID
//         firstName: string
//         lastName: string
//       }
//       rating?: {type: 'number'; value: number} | {type: 'plus_minus'; value: PlusMinusRatingValue}
//       comment?: string
//     }[]
//   }[]
// }

// export interface ILeague {
//   _id: string
//   name: string
// }

// export interface IGameTeam {
//   _id: string
//   name: string
// }

// export interface IGame {
//   home: IGameTeam
//   away: IGameTeam
//   league: null | ILeague
//   date: string
//   datetime?: string
//   scores: string
//   score_home: string
//   score_away: string
//   isManuallyCreated?: boolean
//   gameType?: 'FRIENDLY' | 'REGULAR'
// }

// export interface CreateVideoUploadDto {
//   game: {
//     home: {
//       _id: string
//       name: string
//     }
//     away: {
//       _id: string
//       name: string
//     }
//     league: null | {
//       _id: string
//       name: string
//     }
//     date: string
//     datetime?: string
//     scores: string
//     score_home: string
//     score_away: string
//     isManuallyCreated: boolean
//     gameType?: 'FRIENDLY' | 'REGULAR'
//   }
//   files: Array<{
//     name: string
//     part: VideoUploadPart
//     size: number
//     type: string
//     notes?: string
//   }>
//   allFilesIncluded: boolean
//   lineupAttachments?: {
//     name: string
//     description: string
//   }[]
//   lineupDescription?: string
//   organization?: {
//     _id: string
//     type: string
//     name: string
//   }
// }

// export type VideoUploadPart = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8' | 'P9' | 'P10'
// export interface VideoUploadRecord {
//   _id: string
//   game: {
//     home: {
//       _id: string
//       name: string
//     }
//     away: {
//       _id: string
//       name: string
//     }
//     league: null | {
//       _id: string
//       name: string
//     }
//     date: string
//     datetime?: string
//     scores: string
//     score_home: string
//     score_away: string
//     isManuallyCreated: boolean
//     gameType?: 'FRIENDLY' | 'REGULAR'
//   }
//   files: Array<VideoUploadFile>
//   uploader: {
//     _id: string
//     firstName: string
//     lastName: string
//     email: string
//   }
//   allFilesIncluded: boolean
//   lineupAttachments?: {
//     _id: string
//     name: string
//     size: number
//     description: string
//     url: string
//     addedAt: number
//     addedBy: string
//   }[]
//   lineupDescription?: string
//   organization?: {
//     _id: string
//     type: string
//     name: string
//   }
//   createdAt: number
//   status: 'new' | 'processing' | 'encoding' | 'completed' | 'error'
//   lastStatusAt: number
//   publishedUrls: string[]
//   replacedBy?: string
//   errorMessage?: string
// }

// export interface VideoUploadFile {
//   name: string
//   part: VideoUploadPart
//   size: number
//   type: string
//   notes: string
//   fileId: string
//   startedAt?: number
//   readyAt?: number
//   expireAt?: number
//   s3Key?: string
//   s3Bucket: string
//   s3BucketRegion: string
//   apiServer?: string
//   apiRegion?: string
//   bytesUploaded?: number
//   percentageUploaded?: number
//   lastProgress?: number
//   uploadTimeInSeconds?: number
//   currentUploadSpeedInMbitS?: number
//   averageUploadSpeedInMbitS?: number
//   status: VideoUploadFileStatus
// }

// export interface ModifyVideoUploadDto {
//   allFilesIncluded: boolean
//   additions?: {
//     name: string
//     type: string
//     size: number
//     part: string
//     notes?: string
//   }[]
// }

// export interface ReplaceVideoUploadDto {
//   previous: {
//     _id: string
//     game: VideoUploadRecord['game']
//   }
//   current: CreateVideoUploadDto
// }

// export interface GetVideoUploadStatusDto {
//   ids: string[]
// }

// export interface UpdateFileStatusDto {
//   status: VideoUploadFileStatus
//   bytesUploaded?: number
//   percentageUploaded?: number
//   uploadToken?: string
// }

// export type VideoUploadFileStatus =
//   | 'created'
//   | 'uploading'
//   | 'paused'
//   | 'error'
//   | 'completed'
//   | 'abandoned'

// // ===============================================================
// // ======================== TAGGING EDITOR =======================
// // ===============================================================

// export type AnyShape = DrawingTypes.AnyShape

// export enum TaggingControlType {
//   BUTTON = 'button',
//   LABEL = 'label',
// }

// export enum TaggingLabelType {
//   TEXT = 'text',
//   PLAYER = 'player',
//   TEAM = 'team',
// }

// export enum TaggingLabelBehavior {
//   PRE_ACTION = 'pre-action',
//   POST_ACTION = 'post-action',
// }

// export interface Author {
//   firstName: string
//   lastName: string
//   organizationId: null | string
//   _id: string
// }

// export interface BaseOfflineRecord {
//   _id?: string
//   id: string
//   createdAt: number
//   createdBy: null | Author
//   lastModifiedAt: null | number
//   lastModifiedBy: null | Author
//   revision?: string
//   deleted?: boolean
//   __lastSyncedAt__?: number
// }

// export enum PolicyRole {
//   READER = 'reader',
//   COMMENT_ONLY = 'comment_only',
//   READ_AND_WRITE = 'read_and_write',
//   EDITOR = 'editor',
//   OWNER = 'owner',
// }

// export enum PrincipalType {
//   USER = 'user_permission',
//   EMAIL = 'email_permission',
//   GROUP = 'group_permission',
//   ORGANIZATION = 'org_permission',
//   PUBLIC = 'public_permission',
// }

// export interface BaseSharingPolicyRecord<ID = string> {
//   _id: ID
//   principalType: PrincipalType
//   principalId: string
//   role: PolicyRole
//   expiresAt: null | number
//   inheritedFrom: null | string
//   createdAt: number
//   createdBy: ID
//   publicId?: string // should be set when email or public
//   publicToken?: string // should be set when email or public
//   updatedAt?: number
//   updatedBy?: ID
//   revoked?: boolean
// }

// export interface PlaylistSharingPolicyRecord<ID = string> extends BaseSharingPolicyRecord<ID> {
//   playlistId: string
// }

// export interface TaggingTemplateSharingPolicyRecord<ID = string>
//   extends BaseSharingPolicyRecord<ID> {
//   templateId: string
// }

// export interface DriveNodeSharingPolicyRecord<ID = string> extends BaseSharingPolicyRecord<ID> {
//   driveId: string
//   driveNodeId: string
// }

// export interface EmbeddedSharingPolicy<ID = string> {
//   policyId: ID
//   role: PolicyRole
//   principalType: PrincipalType
//   principalId: string
//   inheritedFrom: null | string
//   expiresAt: null | number
// }

// export interface Playlist extends BaseOfflineRecord {
//   type: 'playlist'
//   name: string
//   parent: null | string
//   workspace: null | string
//   clipIndex: Record<string, string> // clipId:orderKey pair
//   meta: {
//     gameId?: string
//     driveFileUrl?: string
//     file?: {
//       uri: string
//       name: string
//       computerName: string
//       path: string
//     }
//   }
//   isExpanded?: never
//   capabilities?: Capabilities<PlaylistSharingPolicyRecord> // these field are set and return from the server
// }

// export interface Folder extends BaseOfflineRecord {
//   type: 'folder'
//   name: string
//   parent: null | string
//   workspace: null | string
//   capabilities?: Capabilities<PlaylistSharingPolicyRecord>
// }

// interface BreadcrumbItem {
//   id: string
//   name: string
//   deleted?: boolean
// }

// export interface DriveFolder extends BaseOfflineRecord {
//   type: 'drivefolder'
//   name: string
//   parent: null | string
//   driveId: string
//   breadcrumbs?: BreadcrumbItem[]
//   sharedBreadcrumbs?: BreadcrumbItem[]
//   capabilities?: Capabilities<DriveNodeSharingPolicyRecord>
// }

// export interface DriveFile extends BaseOfflineRecord {
//   type: 'drivefile'
//   name: string
//   parent: null | string
//   driveId: string
//   meta: {
//     fileId: string // s3 key
//     companionFileId?: string
//     fileName: string
//     size: number
//     type: string
//     status: VideoUploadFileStatus
//     s3Bucket: string
//     s3BucketRegion: string
//     s3Key: null | string
//     startedAt?: number
//     readyAt?: number
//     expireAt?: number
//     bytesUploaded?: number
//     percentageUploaded?: number
//     lastProgress?: number
//     uploadTimeInSeconds?: number
//     currentUploadSpeedInMbitS?: number
//     averageUploadSpeedInMbitS?: number
//     errorMessage?: null | string
//   }
//   breadcrumbs?: BreadcrumbItem[]
//   sharedBreadcrumbs?: BreadcrumbItem[]
//   capabilities?: Capabilities<DriveNodeSharingPolicyRecord>
// }

// export type DriveNode = DriveFolder | DriveFile

// export interface DriveUsage {
//   driveId: string
//   allowed: number
//   used: number
// }

// export interface EmbeddedPlayer {
//   _id: string
//   firstName: string
//   lastName: string
//   jerseyNumber: string
//   position: string
//   teamId: string
//   isHomeTeam: boolean
// }

// export interface EmbeddedTeam {
//   _id: string
//   name: string
//   isHomeTeam: boolean
// }

// export type EmbeddedGameEvent = PolymorphicEvent &
//   ExtraEventFields & {
//     meta: {
//       player?: null | EmbeddedPlayer
//       team?: null | EmbeddedTeam
//       assist1?: null | EmbeddedPlayer
//       assist2?: null | EmbeddedPlayer
//       blocker?: null | EmbeddedPlayer
//       winnerPlayer?: null | EmbeddedPlayer
//       loserPlayer?: null | EmbeddedPlayer
//       countdownStart?: null | string
//       countdownEnd?: null | string
//       countdown?: null | string
//       countupStart?: null | string
//       countupEnd?: null | string
//       countup?: null | string
//       home_on_ice?: EmbeddedPlayer[]
//       away_on_ice?: EmbeddedPlayer[]
//       home_goalie?: EmbeddedPlayer
//       away_goalie?: EmbeddedPlayer
//     }
//   }

// export interface Clip extends BaseOfflineRecord {
//   type: 'clip'
//   playlistId: string
//   title: string
//   videoUrl: string
//   vbegin: number
//   vend: number
//   annotations: Record<string, ClipAnnotation>
//   additionalFeeds?: Record<
//     string,
//     {
//       name: string
//       videoUrl: string
//       vbegin: number
//       vend: number
//       // it make sense for the annotations to be attached to different feeds
//       // as most of the time, anything you draw on screen will not be correct any more
//       // if the scene has changed
//       annotations: Record<number, ClipAnnotation>
//     }
//   >
//   event: EmbeddedGameEvent
//   game: null | {
//     home: EmbeddedTeam
//     away: EmbeddedTeam
//     date: string
//     midCompetition: null | string
//   }

//   file?: null | {
//     uri: string
//     name: string
//     path?: string
//     computerName?: string
//   }

//   taggingData?: {
//     button: {
//       id: string
//       fill: string
//       textColor: string
//     } | null
//     labels: ClipLabel[]
//   }
//   // TODO: remove this field
//   vclipInfo: VirtualClipInfo | null

//   // this type mainly so TS prevent casting ClipNode to Clip, which is useful when
//   // we want to send thing to server
//   isSelected?: never
// }

// export type ClipLabel =
//   | {
//       type: TaggingLabelType.TEXT
//       id: string
//       fill: string
//       textColor: string
//       text: string
//     }
//   | {
//       type: TaggingLabelType.PLAYER
//       id: string
//       fill: string
//       textColor: string
//       text: string
//       playerId: string
//     }
//   | {
//       type: TaggingLabelType.TEAM
//       id: string
//       fill: string
//       textColor: string
//       text: string
//       teamId: string
//     }

// export type VirtualClipInfo = {
//   vclipPath: string
//   vbeginPadded: number
//   vendPadded: number
// }

// export interface ClipAnnotation {
//   id: string
//   isTracking: boolean
//   videoTimeMs: number
//   shapes: Record<string, AnyShape>
//   frames?: Record<
//     number,
//     {
//       videoTimeMs: number
//       shapes: Record<string, AnyShape>
//     }
//   >
//   pauseDuration: number
//   createdAt: number
//   createdBy: Author
//   comment: string
//   replies: Record<string, AnnotationReply>
// }

// export interface AnnotationReply {
//   id: string
//   comment: string
//   createdAt: number
//   createdBy: Author
// }

// export interface Change {
//   _id?: string
//   id: string
//   message: string
//   base: string | null // base is null for the case of CREATE
//   patches: Patch[]
//   inversePatches: Patch[]
//   timestamp: number
//   transactionId: null | string
// }

// export interface PlaylistChange extends Change {
//   playlistId: string
//   createdSnapshot?: Playlist | Folder
// }

// export interface ClipChange extends Change {
//   playlistId: string
//   clipId: string
//   createdSnapshot?: Clip
// }

// export interface TaggingTemplateChange extends Change {
//   templateId: string
//   createdSnapshot?: TaggingTemplate
// }

// export interface DriveNodeChange extends Change {
//   driveNodeId: string
//   driveId: string
//   createdSnapshot?: DriveNode & {
//     // this field is used during creation of the record to dictate sharing policies, it is not persisted
//     initialPermission?: 'private' | 'organization'
//   }
// }

// export interface Capabilities<T extends BaseSharingPolicyRecord = BaseSharingPolicyRecord> {
//   policies: T[]
//   appliedPolicy: null | T
//   subscribed: boolean
//   isOwner: boolean
//   isDirectShare: boolean
//   canView: boolean
//   canComment: boolean
//   canEdit: boolean
//   canShare: boolean
//   canMove: boolean
//   canDelete: boolean
// }

// export type PlaylistOrFolder = Playlist | Folder
// export type LibraryTreeNode = Playlist | Folder

// export interface TaggingTemplate extends BaseOfflineRecord {
//   type: 'tagging_template'
//   name: string
//   canvasSize: {width: number; height: number}
//   controls: Record<string, AnyTaggingControl>
//   parent: null | string
//   workspace: null | string
//   capabilities?: Capabilities<TaggingTemplateSharingPolicyRecord>
// }

// export type AnyTaggingControl = TaggingButton | TaggingLabel

// export interface TaggingButton extends DrawingTypes.BaseShape {
//   type: TaggingControlType.BUTTON
//   fill: string
//   text: string
//   fontSize: number
//   textColor: string
//   italic: boolean
//   bold: boolean
//   underline: boolean
//   preTime: number
//   postTime: number
//   hotKey: string
//   shouldPausePlayback: boolean
//   shouldRecord: boolean
// }

// export interface TaggingLabel extends DrawingTypes.BaseShape {
//   type: TaggingControlType.LABEL
//   fill: string
//   text: string
//   fontSize: number
//   textColor: string
//   italic: boolean
//   bold: boolean
//   hotKey: string
//   underline: boolean
//   labelType: TaggingLabelType
//   behavior: TaggingLabelBehavior
// }

// export interface PullPayload {
//   since: null | number
//   playlists?: Record<string, {since: number}>
// }

// export interface PullResponse {
//   playlists: (Playlist | Folder)[]
//   clipsByPlaylist: Record<string, null | Clip[]>
//   maxTimestamp: number
// }

// export interface BulkGetPayload {
//   items: Array<{
//     type: 'playlists' | 'clips'
//     id: string
//   }>
// }

// export interface SyncRequest<T> {
//   method: 'POST' | 'PUT' | 'DELETE'
//   collection: 'playlists' | 'clips'
//   record: T
// }

// // ===============================================================
// // ================= END OF TAGGING EDITOR =======================
// // ===============================================================

// type DownloadJobFormat = 'mp4' | 'zip'

// export type CreateNextgenDownloadJobDto = {
//   name: string
//   nextgenClips: NextgenClip[]
//   format: DownloadJobFormat
//   useSQS?: boolean
// }

// export interface NextgenClip {
//   videoUrl: string
//   id: string
//   name: string
//   vbegin: number
//   vend: number
//   annotations: Record<string, ClipAnnotation>
// }

// export type VirtualClipsDownloadRequestDto = {
//   _id: string
//   date: string
//   name: string
//   format: 'mp4' | 'zip'
//   duration: number
//   status: 'pending' | 'downloading' | 'uploading' | 'remuxing' | 'done' | 'error'
//   url?: string
//   expiry?: string
//   size?: number
//   errorDetails?: string
//   isExpired: boolean
// }

// /**
//  * Event Filters
//  * Should be 1-1 mapping with backend
//  */

// export type FilteredPrimitiveValue = number | string | boolean

// export type FilterValue = FilteredPrimitiveValue | FilteredPrimitiveValue[]

// export interface GeneralFilter {
//   playerIds?: string[]
//   gameIds?: string[]
//   periods?: (string | number)[]
//   strengths?: string[]
//   teamIds?: string[]
//   leagueIds?: string[]
//   seasons?: string[]
// }

// export type ShotPresetFields = 'shotTypes' | 'screened' | 'oneTimer' | 'deflection' | 'shotLocation'
// export type ShotPresetFilter = Partial<Record<ShotPresetFields, FilteredPrimitiveValue[]>>

// export type PassPresetFields =
//   | 'zones'
//   | 'receptionZones'
//   | 'outcome'
//   | 'types'
//   | 'ozPassEntries'
//   | 'dzPassExits'
//   | 'boardUsage'
//   | 'directions'
//   | 'rushPass'
//   | 'team'
//   | 'passers'
//   | 'receivers'
//   | 'primaryAssist'
//   | 'secondaryAssist'
// export type PassPresetFilter = Partial<Record<PassPresetFields, FilteredPrimitiveValue[]>>

// export type PresetFilter =
//   | {presetName: 'shots'; filter: ShotPresetFilter}
//   | {presetName: 'passes'; filter: PassPresetFilter}

// export interface EventFilter {
//   generalFilters: GeneralFilter
//   presetFilter: PresetFilter
// }
