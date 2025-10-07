export const setButtonText = (
  buttonEl,
  isLoading,
  normal = "Save",
  loading = "Saving…"
) => {
  if (!buttonEl) return;
  buttonEl.textContent = isLoading ? loading : normal;
};

export function renderLoading(
  isLoading,
  button,
  buttonText = "Save",
  loadingText = "Saving…"
) {
  button.textContent = isLoading ? loadingText : buttonText;
  button.disabled = isLoading;
}
