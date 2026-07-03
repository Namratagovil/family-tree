export interface Person {
  id: string
  name: string
  parentId: string | null
  generation: number
  spouse?: string
  notes?: string
  photoUrl?: string
}

export interface LayoutNode extends Person {
  x: number
  y: number
  width: number
  height: number
  hasChildren: boolean
  childCount: number
  isCollapsed: boolean
}

export interface TreeEdge {
  id: string
  path: string
  parentId: string
  childId: string
}

export interface TreeLayout {
  nodes: LayoutNode[]
  edges: TreeEdge[]
  canvasWidth: number
  canvasHeight: number
}

export type ViewMode = 'canvas' | 'list'

export type LayoutDirection = 'top-down' | 'bottom-up'
export type LayoutAlignment = 'left' | 'center' | 'right'
export type ThemeMode = 'light' | 'dark'
