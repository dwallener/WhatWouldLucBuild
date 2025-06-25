import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import Card from "./Card";

interface CardData {
  id: string;
  title: string;
}

export default function Column({
  id,
  title,
  cards,
  onAddCard,
  onUpdateCard,
  editingCardId,
  setEditingCardId,
}: {
  id: string;
  title: string;
  cards: CardData[];
  onAddCard: () => void;
  onUpdateCard: (cardId: string, newTitle: string) => void;
  editingCardId: string | null;
  setEditingCardId: (id: string | null) => void;
}) {
  return (
    <div className="bg-white rounded-lg p-4 w-80 shadow">
      <h2 className="text-lg font-semibold mb-2 text-gray-700 border-b pb-1">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-2 min-h-[60px]">
            {cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                isEditing={editingCardId === card.id}
                onEditEnd={(newTitle) => onUpdateCard(card.id, newTitle)}
                setEditingCardId={setEditingCardId}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <button onClick={onAddCard} className="mt-2 text-sm text-blue-500 hover:underline">
        + Add Card
      </button>
    </div>
  );
}
