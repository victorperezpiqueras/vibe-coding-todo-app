import type { Item } from '../types'
import Tag from './Tag'

interface TaskCardProps {
  item: Item
  onDelete: (itemId: number) => void
  onDragStart: (e: React.DragEvent<HTMLElement>, item: Item) => void
}

export default function TaskCard({ item, onDelete, onDragStart }: TaskCardProps) {
  return (
    <article
      data-testid={`task-${item.id}`}
      className="group rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md cursor-grab"
      draggable
      onDragStart={(e) => onDragStart(e, item)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-slate-800">{item.name}</h3>
          {item.description && (
            <p className="mt-1 text-xs text-slate-500">{item.description}</p>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <Tag key={tag.id} name={tag.name} color={tag.color} />
              ))}
            </div>
          )}
        </div>
        <button
          data-testid={`delete-task-${item.id}`}
          onClick={() => onDelete(item.id)}
          className="opacity-0 group-hover:opacity-100 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
        >
          Delete
        </button>
      </div>
    </article>
  )
}
