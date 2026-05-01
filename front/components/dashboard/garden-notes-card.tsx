"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NotebookPen, Calendar, Plus, X } from "lucide-react"

interface Note {
  id: number
  text: string
  date: string
}

interface GardenNotesCardProps {
  notes: Note[]
  onAddNote?: (text: string) => void
}

export function GardenNotesCard({ notes, onAddNote }: GardenNotesCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newNote, setNewNote] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newNote.trim() && onAddNote) {
      onAddNote(newNote.trim())
      setNewNote("")
      setIsAdding(false)
    }
  }

  const handleCancel = () => {
    setNewNote("")
    setIsAdding(false)
  }

  return (
    <Card className="border-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NotebookPen className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-medium">My Garden Notes</CardTitle>
          </div>
          {!isAdding && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add note</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <form onSubmit={handleSubmit} className="mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your garden note..."
              autoFocus
              className="w-full resize-none rounded-lg border border-border bg-secondary/30 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              rows={3}
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 text-muted-foreground"
              >
                <X className="mr-1 h-3 w-3" />
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!newNote.trim()}
                className="h-8"
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Note
              </Button>
            </div>
          </form>
        )}
        <div className="styled-scrollbar max-h-64 space-y-3 overflow-y-auto pr-2">
          {notes.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No notes yet. Click + to add your first note.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="group rounded-lg border border-border/50 bg-secondary/30 p-4 transition-all hover:bg-secondary/50 hover:shadow-sm"
              >
                <p className="text-sm text-foreground leading-relaxed">{note.text}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{note.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
