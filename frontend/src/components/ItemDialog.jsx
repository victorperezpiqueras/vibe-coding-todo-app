import { useEffect, useState } from 'react'
import TagSelector from './TagSelector'

/**
 * Dialog for creating or editing items
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {Function} props.onClose - Callback when dialog is closed
 * @param {Function} props.onSubmit - Callback when form is submitted
 * @param {Object} props.item - Item to edit (null for create mode)
 * @param {Array} props.availableTags - Available tags for selection
 * @param {Function} props.onCreateTag - Callback to create a new tag
 */
function ItemDialog({ isOpen, onClose, onSubmit, item = null, availableTags, onCreateTag }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState([])

  const isEditMode = item !== null

  // Reset form when dialog opens/closes or item changes
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setName(item.name || '')
        setDescription(item.description || '')
        setSelectedTagIds(item.tags?.map(t => t.id) || [])
      } else {
        setName('')
        setDescription('')
        setSelectedTagIds([])
      }
    }
  }, [isOpen, item])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      tag_ids: selectedTagIds,
    })
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setSelectedTagIds([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        data-testid="dialog-backdrop"
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label htmlFor="task-name" className="block text-sm font-medium text-slate-700 mb-1">
              Task Name
            </label>
            <input
              id="task-name"
              data-testid="dialog-task-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter task name"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              id="task-description"
              data-testid="dialog-task-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              rows={3}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tags
            </label>
            <TagSelector
              availableTags={availableTags}
              selectedTagIds={selectedTagIds}
              onTagsChange={setSelectedTagIds}
              onCreateTag={onCreateTag}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md bg-slate-200 text-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="dialog-submit-button"
              className="rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-500"
            >
              {isEditMode ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ItemDialog
