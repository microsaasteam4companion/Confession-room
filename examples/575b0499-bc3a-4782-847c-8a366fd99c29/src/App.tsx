import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, Gift, Sparkles } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  timestamp: number;
}

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('blindBoxNotes');
    return saved ? JSON.parse(saved) : [];
  });
  const [newNote, setNewNote] = useState('');
  const [drawnNote, setDrawnNote] = useState<Note | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    localStorage.setItem('blindBoxNotes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      timestamp: Date.now(),
    };

    setNotes(prev => [...prev, note]);
    setNewNote('');
  };

  const handleDrawNote = () => {
    if (notes.length === 0) {
      alert('盲盒是空的哦，快来投放一些纸条吧！');
      return;
    }

    setIsDrawing(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * notes.length);
      const drawn = notes[randomIndex];
      setDrawnNote(drawn);
      setNotes(prev => prev.filter(note => note.id !== drawn.id));
      setIsDrawing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">神秘盲盒</h1>
          <p className="text-gray-600">写下你的心情，抽取别人的故事</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <form onSubmit={handleAddNote} className="space-y-4">
            <div className="flex items-center space-x-2">
              <MessageSquarePlus className="text-purple-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-800">投放纸条</h2>
            </div>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
              placeholder="写下你想说的话..."
              rows={3}
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              放入盲盒
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Gift className="text-purple-500 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-800">抽取纸条</h2>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">当前盒子里有 {notes.length} 张纸条</p>
            <button
              onClick={handleDrawNote}
              disabled={isDrawing}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {isDrawing ? (
                <span className="flex items-center justify-center">
                  <Sparkles className="animate-spin mr-2" />
                  抽取中...
                </span>
              ) : (
                '抽取一张纸条'
              )}
            </button>

            {drawnNote && (
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-gray-700">{drawnNote.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(drawnNote.timestamp).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;