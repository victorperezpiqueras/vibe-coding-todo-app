import { useState, useEffect } from 'react'
import Modal from './Modal'
import TagSelector from './TagSelector'

/**
 * ItemDetailDialog component for viewing and editing item details
 * Displays all item fields with inline editing capabilities
 */
function ItemDetailDialog({ item, isOpen, onClose, onSave, availableTags, onCreateTag }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  // Initialize form fields when item or dialog state changes
  useEffect(() => {
    if (item && isOpen) {
      setName(item.name || '')
      setDescription(item.description || '')
      setSelectedTagIds(item.tags?.map(tag => tag.id) || [])
      setError('')
    }
  }, [item, isOpen])

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      await onSave({
        id: item.id,
        name: name.trim(),
        description: description.trim(),
        tag_ids: selectedTagIds,
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setError('')
    onClose()
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  if (!item) return null

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Task Details">
      <div className="space-y-4">
        {/* Error message */}
        {error && (
          <div className="rounded-md bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Name field */}
        <div>
          <label htmlFor="item-name" className="block text-sm font-medium text-slate-700 mb-1">
            Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="item-name"
            data-testid="item-detail-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Task name"
          />
        </div>

        {/* Description field */}
        <div>
          <label htmlFor="item-description" className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            id="item-description"
            data-testid="item-detail-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Task description"
          />
        </div>

        {/* Tags field */}
        <div>
          <TagSelector
            availableTags={availableTags}
            selectedTagIds={selectedTagIds}
            onTagsChange={setSelectedTagIds}
            onCreateTag={onCreateTag}
          />
        </div>

        {/* Timestamps (read-only) */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Created
            </label>
            <p className="text-sm text-slate-700" data-testid="item-detail-created">
              {formatDateTime(item.created_at)}
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Updated
            </label>
            <p className="text-sm text-slate-700" data-testid="item-detail-updated">
              {formatDateTime(item.updated_at)}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <button
            data-testid="item-detail-save"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            data-testid="item-detail-cancel"
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1 rounded-md bg-slate-200 text-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ItemDetailDialog
