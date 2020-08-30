export interface Topic {
  id?: number
  slug?: string
  content: string
  ancestry: string | null
  position: number
  user_id: number
  descendants?: Topic[]
}
