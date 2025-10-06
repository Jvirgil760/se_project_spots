export const setButtonText = (
  buttonEl,
  isLoading,
  normal = "Save",
  loading = "Saving…"
) => {
  if (!buttonEl) return;
  buttonEl.textContent = isLoading ? loading : normal;
};
