import { Person, LayoutNode, TreeEdge, TreeLayout } from '@/types'

export const NODE_W = 130
export const NODE_H = 54
export const H_GAP = 14
export const V_GAP = 72

export function computeLayout(members: Person[]): TreeLayout {
  const memberMap = new Map(members.map(m => [m.id, m]))
  const childrenMap = new Map<string, string[]>()

  for (const m of members) {
    if (m.parentId) {
      const arr = childrenMap.get(m.parentId) ?? []
      arr.push(m.id)
      childrenMap.set(m.parentId, arr)
    }
  }

  const positions = new Map<string, { x: number; y: number }>()
  let leafIndex = 0

  function layout(id: string, depth: number): { left: number; right: number } {
    const children = childrenMap.get(id) ?? []
    const y = depth * (NODE_H + V_GAP)

    if (children.length === 0) {
      const x = leafIndex * (NODE_W + H_GAP)
      positions.set(id, { x, y })
      leafIndex++
      return { left: x, right: x + NODE_W }
    }

    const childRanges = children.map(cid => layout(cid, depth + 1))
    const leftEdge = childRanges[0].left
    const rightEdge = childRanges[childRanges.length - 1].right
    const x = (leftEdge + rightEdge - NODE_W) / 2
    positions.set(id, { x, y })
    return { left: x, right: x + NODE_W }
  }

  layout('1', 0)

  const nodes: LayoutNode[] = members
    .filter(m => positions.has(m.id))
    .map(m => ({
      ...m,
      ...positions.get(m.id)!,
      width: NODE_W,
      height: NODE_H,
    }))

  const edges: TreeEdge[] = members
    .filter(m => m.parentId && positions.has(m.id) && positions.has(m.parentId!))
    .map(m => {
      const child = positions.get(m.id)!
      const parent = positions.get(m.parentId!)!
      const x1 = parent.x + NODE_W / 2
      const y1 = parent.y + NODE_H
      const x2 = child.x + NODE_W / 2
      const y2 = child.y
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
