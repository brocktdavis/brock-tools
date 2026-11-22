/** Given a URL, fetches the data and returns the Blob for that data. */
export const downloadAudioToBlob = async (url: URL) => {
  const response = await fetch(url, {
    credentials: "include",
    headers: { "Range": "bytes=0-" }
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return await response.blob();
};

export const downloadAudioBlob = (blob: Blob, baseName: string, ext = 'mp3') => {
  const filename = `${baseName}.${ext}`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.append(a);
  a.click();
  a.remove();

  // Give the browser time to start the download before freeing the URL
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}