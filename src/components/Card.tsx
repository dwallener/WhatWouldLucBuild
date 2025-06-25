// src/components/Card.tsx
import React, { useEffect, useRef, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { autofillTask } from "../lib/llmClient";

export default function Card({
  card,
  index,
  isEditing,
  onEditEnd,
  setEditingCardId,
}: {
  card: { id: string; title: string };
  index: number;
  isEditing: boolean;
  onEditEnd: (newTitle: string) => void;
  setEditingCardId: (id: string | null) => void;
}) {
  const [draft, setDraft] = useState(card.title || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldEdit = isEditing || !card.title;

  useEffect(() => {
    if (shouldEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldEdit]);

  useEffect(() => {
    console.log("🔄 Card mounted:", card.title, "shouldEdit:", shouldEdit);
  }, []);

  async function handleAutofill() {
    console.log("🧠 Autofill button clicked");
    const suggestion = await autofillTask(`The user entered this text: "${draft}". Suggest three short, clear bullet points for this project. Keep each point concise.`);
    console.log("🧠 GPT returned:", suggestion);
    setDraft(suggestion);
    onEditEnd(suggestion);
  }

  function handleBlur() {
    if (draft.trim()) {
      onEditEnd(draft.trim());
    } else {
      onEditEnd("Untitled Task");
    }
    setEditingCardId(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  }

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          className="bg-gray-100 rounded p-2 shadow-sm flex flex-col gap-1"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onDoubleClick={() => setEditingCardId(card.id)}
        >
          {shouldEdit ? (
            <>
              <input
                ref={inputRef}
                className="w-full bg-white p-1 text-sm rounded border"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="Enter task name..."
              />
              <button
                onClick={handleAutofill}
                className="text-xs text-blue-500 underline self-start"
              >
                Autofill
              </button>
            </>
          ) : (
            <>
              <p className="text-sm">{card.title}</p>
              <button
                onClick={() => {
                  setEditingCardId(card.id);
                  setTimeout(() => {
                    handleAutofill();
                  }, 0);
                }}
                className="text-xs text-blue-500 underline self-start"
              >
                Autofill
              </button>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}
