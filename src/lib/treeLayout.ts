import { Person, LayoutNode, TreeEdge, TreeLayout, LayoutDirection, LayoutAlignment } from '@/types'

export const NODE_W = 130
export const NODE_H = 54
export const H_GAP = 14
export const V_GAP = 72

export interface LayoutOptions {
  direction: LayoutDirection
  alignment: LayoutAlignment
  collapsedIds?: Set<string>
}

export const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
  direction: 'top-down',
  alignment: 'center',
}

/**
 * By default only the first couple of generations are expanded — a 96-member
 * tree fully expanded at once is unreadable, so descendants collapse behind
 * their nearest ancestor until the user opts in.
 */
export function getDefaultCollapsedIds(members: Person[], maxVisibleDepth = 2): Set<string> {
  const childrenMap = new Map<string, string[]>()
  for (const m of members) {
    if (m.parentId) {
      const arr = childrenMap.get(m.parentId) ?? []
      arr.push(m.id)
      childrenMap.set(m.parentId, arr)
    }
  }

  const collapsed = new Set<string>()
  function walk(id: string, depth: number) {
    const kids = childrenMap.get(id) ?? []
    if (kids.length === 0) return
    if (depth >= maxVisibleDepth) {
      collapsed.add(id)
      return
    }
    for (const k of kids) walk(k, depth + 1)
  }
  walk('1', 0)
  return collapsed
}

export function computeLayout(
  members: Person[],
  options: LayoutOptions = DEFAULT_LAYOUT_OPTIONS
): TreeLayout {
  const { direction, alignment, collapsedIds } = options
  const fullChildrenMap = new Map<string, string[]>()

  for (const m of members) {
    if (m.parentId) {
      const arr = fullChildrenMap.get(m.parentId) ?? []
      arr.push(m.id)
      fullChildrenMap.set(m.parentId, arr)
    }
  }

  // Children used for positioning — a collapsed node is treated as a leaf
  // even though it may have real descendants (tracked separately below).
  const childrenOf = (id: string): string[] =>
    collapsedIds?.has(id) ? [] : fullChildrenMap.get(id) ?? []

  // First pass: depth of every visible node, so bottom-up mode can invert the axis.
  const depths = new Map<string, number>()
  let maxDepth = 0
  function measureDepth(id: string, depth: number) {
    depths.set(id, depth)
    maxDepth = Math.max(maxDepth, depth)
    for (const cid of childrenOf(id)) measureDepth(cid, depth + 1)
  }
  measureDepth('1', 0)

  const rowStep = NODE_H + V_GAP
  const yForDepth = (depth: number) =>
    direction === 'bottom-up' ? (maxDepth - depth) * rowStep : depth * rowStep

  const positions = new Map<string, { x: number; y: number }>()
  let leafIndex = 0

  function layout(id: string, depth: number): { left: number; right: number } {
    const children = childrenOf(id)
    const y = yForDepth(depth)

    if (children.length === 0) {
      const x = leafIndex * (NODE_W + H_GAP)
      positions.set(id, { x, y })
      leafIndex++
      return { left: x, right: x + NODE_W }
    }

    const childRanges = children.map(cid => layout(cid, depth + 1))
    const leftEdge = childRanges[0].left
    const rightEdge = childRanges[childRanges.length - 1].right

    let x: number
    if (alignment === 'left') {
      x = leftEdge
    } else if (alignment === 'right') {
      x = rightEdge - NODE_W
    } else {
      x = (leftEdge + rightEdge - NODE_W) / 2
    }

    positions.set(id, { x, y })
    return { left: x, right: x + NODE_W }
  }

  layout('1', 0)

  const nodes: LayoutNode[] = members
    .filter(m => positions.has(m.id))
    .map(m => {
      const childCount = fullChildrenMap.get(m.id)?.length ?? 0
      return {
        ...m,
        ...positions.get(m.id)!,
        width: NODE_W,
        height: NODE_H,
        hasChildren: childCount > 0,
        childCount,
        isCollapsed: collapsedIds?.has(m.id) ?? false,
      }
    })

  // Parent -> child anchor points flip depending on which one sits visually above the other.
  const parentIsAbove = (parentY: number, childY: number) => parentY <= childY

  const edges: TreeEdge[] = members
    .filter(m => m.parentId && positions.has(m.id) && positions.has(m.parentId!))
    .map(m => {
      const child = positions.get(m.id)!
      const parent = positions.get(m.parentId!)!
      const x1 = parent.x + NODE_W / 2
      const x2 = child.x + NODE_W / 2
      const above = parentIsAbove(parent.y, child.y)
      const y1 = above ? parent.y + NODE_H : parent.y
      const y2 = above ? child.y : child.y + NODE_H
      const my = (y1 + y2) / 2
      return {
        id: `e-${m.parentId}-${m.id}`,
        parentId: m.parentId!,
        childId: m.id,
        path: `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`,
      }
    })

  const allX = Array.from(positions.values()).map(p => p.x)
  const allY = Array.from(positions.values()).map(p => p.y)
  const canvasWidth = Math.max(...allX) + NODE_W + 60
  const canvasHeight = Math.max(...allY) + NODE_H + 60

  return { nodes, edges, canvasWidth, canvasHeight }
}
