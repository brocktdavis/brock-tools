
const DEFAULT_DECK_NAME = "Korean::Brock";
const DEFAULT_MODEL_NAME = "Korean Vocab";


export interface NoteInfo {
  deckName?: string;
  modelName?: string;
  fields: object;
}


const createAnkiConnectPayload = (noteInfo: NoteInfo) => ({
  action: "addNote",
  version: 6,
  params: {
    note: {
      deckName: DEFAULT_DECK_NAME,
      modelName: DEFAULT_MODEL_NAME,
      ...noteInfo,
      tags: [],
      options: {
        allowDuplicate: false,
      },
    },
  },
});

export const createAnkiNote = async (noteInfo: NoteInfo) => {
  const response = await fetch("http://127.0.0.1:8765", {
    method: "POST",
    body: JSON.stringify(createAnkiConnectPayload(noteInfo)),
  });
  const result = await response.json();
  if (result.error) {
    throw new Error(result.error);
  }
  return result.result; // the new note's ID
};