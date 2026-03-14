export function getSavedDesigns() {
  const raw = localStorage.getItem("roomviz-designs");
  return raw ? JSON.parse(raw) : [];
}

export function saveDesign(design) {
  const current = getSavedDesigns();

  const designWithId = {
    id: design.id || crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
    ...design,
  };

  const existingIndex = current.findIndex((item) => item.id === designWithId.id);

  let next;
  if (existingIndex >= 0) {
    next = [...current];
    next[existingIndex] = designWithId;
  } else {
    next = [designWithId, ...current];
  }

  localStorage.setItem("roomviz-designs", JSON.stringify(next));
  return designWithId;
}

export function deleteDesign(designId) {
  const current = getSavedDesigns();
  const next = current.filter((item) => item.id !== designId);
  localStorage.setItem("roomviz-designs", JSON.stringify(next));
}

export function savePendingEditorConfig(config) {
  localStorage.setItem("roomviz-editor-config", JSON.stringify(config));
}

export function getPendingEditorConfig() {
  const raw = localStorage.getItem("roomviz-editor-config");
  return raw ? JSON.parse(raw) : null;
}

export function clearPendingEditorConfig() {
  localStorage.removeItem("roomviz-editor-config");
}