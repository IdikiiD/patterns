const {
  Document,
  TextEditor,
  InsertTextCommand,
  DeleteTextCommand,
  ReplaceTextCommand,
} = require('../patterns/command')

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('  COMMAND PATTERN — Text Editor with Undo / Redo')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const doc    = new Document()
const editor = new TextEditor(doc)

console.log('  [Init]   Empty document created\n')

console.log('  → execute: InsertTextCommand')
editor.execute(new InsertTextCommand(doc, 'Hello, World', 0))

console.log('\n  → execute: InsertTextCommand')
editor.execute(new InsertTextCommand(doc, '!', 12))

console.log('\n  → execute: ReplaceTextCommand')
editor.execute(new ReplaceTextCommand(doc, 7, 5, 'Node.js'))

console.log('\n  → execute: DeleteTextCommand')
editor.execute(new DeleteTextCommand(doc, 0, 7))

console.log('\n  [History Log]:')
console.log(editor.getHistoryLog().join('\n'))

console.log('\n  → editor.undo()')
editor.undo()

console.log('\n  → editor.undo()')
editor.undo()

console.log('\n  → editor.redo()')
editor.redo()
