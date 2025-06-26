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
  onEditEnd: (cardId: string, newTitle: string) => void;
  setEditingCardId: (id: string | null) => void;
}) {
  const [draft, setDraft] = useState(card.title || "");
  const [autofillPending, setAutofillPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldEdit = isEditing || !card.title;

  // Focus on the input when edit mode activates
  useEffect(() => {
    if (shouldEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldEdit]);

  // If we requested autofill before entering edit mode, now trigger it
  useEffect(() => {
    if (shouldEdit && autofillPending) {
      setAutofillPending(false);
      handleAutofill();
    }
  }, [shouldEdit, autofillPending]);

  async function handleAutofill() {
    console.log("🧠 Autofill button clicked");
    const prompt = `The user entered this text: "${draft || "Untitled Task"}". Suggest three short, clear bullet points for this task. Keep each point concise.`;
    const suggestion = await autofillTask(prompt);
    console.log("🧠 GPT returned:", suggestion);
    setDraft(suggestion);
    console.log("💾 Calling onEditEnd with:", suggestion);
    onEditEnd(card.id, suggestion);
  }

  function handleBlur() {
    onEditEnd(card.id, draft.trim() || "Untitled Task");
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
                  setAutofillPending(true); // 🔁 Trigger GPT once editable
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
