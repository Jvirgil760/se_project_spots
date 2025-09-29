export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    // set the loading text
    console.log(`Setting text to ${loadingText}`);
  } else {
    // set not loading text
  }
}
