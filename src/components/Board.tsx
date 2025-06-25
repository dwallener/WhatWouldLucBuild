import React, { useState } from "react";
import Column from "./Column";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

const initialData = {
  columns: {
    todo: {
      title: "Todo",
      cards: [
        { id: "1", title: "Design UI" },
        { id: "2", title: "Setup project" },
      ],
    },
    inprogress: {
      title: "In Progress",
      cards: [],
    },
    done: {
      title: "Done",
      cards: [],
    },
  },
};

export default function Board() {
  const [data, setData] = useState(initialData);

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
    const newCard = {
      id: Date.now().toString(),
      title: "New Task",
    };

    setData((prevData) => {
      const updatedColumn = {
        ...prevData.columns[columnId],
        cards: [...prevData.columns[columnId].cards, newCard],
      };

      return {
        columns: {
          ...prevData.columns,
          [columnId]: updatedColumn,
        },
      };
    });
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
          />
        ))}
      </div>
    </DragDropContext>
  );
}
