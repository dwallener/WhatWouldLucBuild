// src/components/Board.tsx
import React, { useState } from "react";
import Column from "./Column";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

const initialData = {
  columns: {
    todo: {
      title: "Todo",
      cards: [
        { id: "1", title: "Design UI" },
        { id: "2", title: "Setup project" },
      ],
    },
    inprogress: { title: "In Progress", cards: [] },
    done: { title: "Done", cards: [] },
  },
};

export default function Board() {
  const [data, setData] = useState(initialData);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = data.columns[source.droppableId];
    const destCol = data.columns[destination.droppableId];
    const [moved] = sourceCol.cards.splice(source.index, 1);
    destCol.cards.splice(destination.index, 0, moved);

    setData({
      columns: {
        ...data.columns,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol,
      },
    });
  }

  function handleAddCard(columnId: string) {
    const newCard = { id: uuidv4(), title: "" };
    const updatedCards = [...data.columns[columnId].cards, newCard];

    setData({
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          cards: updatedCards,
        },
      },
    });
    setEditingCardId(newCard.id);
  }

  function handleEditEnd(cardId: string, newTitle: string) {
    const updatedColumns = { ...data.columns };
    for (const column of Object.values(updatedColumns)) {
      const card = column.cards.find((c) => c.id === cardId);
      if (card) {
        card.title = newTitle;
      }
    }
    setData({ columns: updatedColumns });
    setEditingCardId(null);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 justify-center p-6">
        {Object.entries(data.columns).map(([key, col]) => (
          <Column
            key={key}
            id={key}
            title={col.title}
            cards={col.cards}
            onAddCard={() => handleAddCard(key)}
            editingCardId={editingCardId}
            setEditingCardId={setEditingCardId}
            onEditEnd={(title) => handleEditEnd(editingCardId!, title)}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
