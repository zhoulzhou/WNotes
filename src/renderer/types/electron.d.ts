
export {};

declare global {
  interface Window {
    electronAPI: {
      getAllNotes: () =&gt; Promise&lt;any[]&gt;;
      createNote: (id: string, title: string) =&gt; Promise&lt;any&gt;;
      deleteNote: (id: string) =&gt; Promise&lt;void&gt;;
      updateNote: (id: string, title: string) =&gt; Promise&lt;void&gt;;
      readNoteFile: (filePath: string) =&gt; Promise&lt;string&gt;;
      writeNoteFile: (filePath: string, content: string) =&gt; Promise&lt;void&gt;;
      saveImage: (file: Buffer, noteId: string) =&gt; Promise&lt;string&gt;;
    };
  }
}
