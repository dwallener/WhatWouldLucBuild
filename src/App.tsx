import React from "react";
import Board from "./components/Board";

export default function App() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">TrelloBot</h1>
      <Board />
    </main>
  );
}