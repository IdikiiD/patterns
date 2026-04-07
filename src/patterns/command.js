/**
 * COMMAND PATTERN
 *
 * Encapsulates a request as an object, thereby letting you parameterize
 * clients with different requests, queue or log requests, and support
 * undoable operations.
 *
 * Key idea: every action becomes an object with execute() and undo().
 * The Invoker (editor) doesn't know what the command does — it just
 * calls execute() and keeps a history stack for undo/redo.
 *
 * Real-world uses: text editors (Ctrl+Z), database transactions,
 * job queues, macro recording, Git commits.
 */

// ─── Receiver — the object that actually does the work ────────────────────

class Document {
  constructor(initialContent = '') {
    this.content = initialContent
  }

  insert(text, position) {
    this.content =
      this.content.slice(0, position) + text + this.content.slice(position)
  }

  delete(position, length) {
    this.content =
      this.content.slice(0, position) + this.content.slice(position + length)
  }

  getContent() {
    return this.content
  }
}

// ─── Concrete Commands ─────────────────────────────────────────────────────

class InsertTextCommand {
  constructor(document, text, position) {
    this.document = document
    this.text     = text
    this.position = position
    this.label    = `Insert "${text}" at pos ${position}`
  }

  execute() {
    this.document.insert(this.text, this.position)
  }

  undo() {
    this.document.delete(this.position, this.text.length)
  }
}

class DeleteTextCommand {
  constructor(document, position, length) {
    this.document = document
    this.position = position
    this.length   = length
    this.deleted  = ''  // saved for undo
    this.label    = `Delete ${length} chars at pos ${position}`
  }

  execute() {
    this.deleted = this.document.getContent().slice(
      this.position,
      this.position + this.length
    )
    this.document.delete(this.position, this.length)
  }

  undo() {
    this.document.insert(this.deleted, this.position)
  }
}

class ReplaceTextCommand {
  constructor(document, position, length, newText) {
    this.document = document
    this.position = position
    this.length   = length
    this.newText  = newText
    this.oldText  = ''
    this.label    = `Replace ${length} chars with "${newText}"`
  }

  execute() {
    this.oldText = this.document.getContent().slice(
      this.position,
      this.position + this.length
    )
    this.document.delete(this.position, this.length)
    this.document.insert(this.newText, this.position)
  }

  undo() {
    this.document.delete(this.position, this.newText.length)
    this.document.insert(this.oldText, this.position)
  }
}

// ─── Invoker — manages the history stack ──────────────────────────────────

class TextEditor {
  constructor(document) {
    this.document  = document
    this.history   = []   // executed commands
    this.redoStack = []   // undone commands
  }

  execute(command) {
    command.execute()
    this.history.push(command)
    this.redoStack = []   // new action clears redo
    console.log(`  [Command]    ✔ ${command.label}`)
    console.log(`  [Document]   "${this.document.getContent()}"`)
  }

  undo() {
    if (!this.history.length) {
      console.log('  [Command]    Nothing to undo.')
      return
    }
    const command = this.history.pop()
    command.undo()
    this.redoStack.push(command)
    console.log(`  [Command]    ↩ Undid: ${command.label}`)
    console.log(`  [Document]   "${this.document.getContent()}"`)
  }

  redo() {
    if (!this.redoStack.length) {
      console.log('  [Command]    Nothing to redo.')
      return
    }
    const command = this.redoStack.pop()
    command.execute()
    this.history.push(command)
    console.log(`  [Command]    ↪ Redid: ${command.label}`)
    console.log(`  [Document]   "${this.document.getContent()}"`)
  }

  getHistoryLog() {
    return this.history.map((cmd, i) => `    ${i + 1}. ${cmd.label}`)
  }
}

module.exports = {
  Document,
  TextEditor,
  InsertTextCommand,
  DeleteTextCommand,
  ReplaceTextCommand,
}
