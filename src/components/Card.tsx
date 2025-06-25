import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { autofillTask } from "../lib/llmClient";

interface CardProps {
  card: { id: string; title: string };
  index: number;
}

export default function Card({ card, index }: CardProps) {
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAutoFill() {
    setLoading(true);
    const text = await autofillTask(card.title);
    setDescription(text);
    setLoading(false);
  }

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded p-3 border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="font-medium">{card.title}</div>
          {description && <div className="text-sm text-gray-600 mt-1">{description}</div>}
          <button
            onClick={handleAutoFill}
            className="text-xs text-blue-600 mt-2 hover:underline disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Generating..." : "✨ Auto-fill"}
          </button>
        </div>
      )}
    </Draggable>
  );
}
