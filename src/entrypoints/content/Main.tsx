import { type MouseEvent } from "react";

import { downloadAudioBlob, downloadAudioToBlob } from "@/utils/audioDownload";
import { createAnkiNote } from "@/utils/createAnkiCard";

import DownloadIcon from "@/assets/download.svg?react";

const WORD_SPAN_SELECTOR = "span.u_word_dic";

export const Content = () => {

  const downloadAudio = async () => {
    const wordSpan = document.querySelector<HTMLElement>(WORD_SPAN_SELECTOR);
    const koreanWord = wordSpan?.textContent;
    if (!koreanWord) {
      throw new Error("Word could not be determined.");
    }

    const baseUrl = import.meta.env.WXT_AUDIO_API_BASE_URL;
    if (!baseUrl) {
      throw new Error("WXT_AUDIO_API_BASE_URL is not set in environment");
    }
    const audioUrl = new URL(`${baseUrl}${koreanWord}`);

    const blob = await downloadAudioToBlob(audioUrl);
    downloadAudioBlob(blob, koreanWord);
  };

  const exportToNote = async () => {
    const wordSpan = document.querySelector<HTMLElement>(WORD_SPAN_SELECTOR);
    const koreanWord = wordSpan?.textContent;
    if (!koreanWord) {
      throw new Error("Word could not be determined.");
    }

    const fields = {
      "Korean": koreanWord,
      "Homonym Index": null,
      "English": "<TODO>",
      "Origin": "<TODO>",
      "Audio": "<TODO>",
      "Image": null,
      "Notes": null,
      "Reference Link": window.location.href,
    };

    createAnkiNote({ fields });
  };

  const onClickDownload = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadAudio();
  };

  const onClickExport = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    exportToNote();
  };

  return (
    <>
      <button
        type="button"
        className="action-btn"
        onClick={onClickDownload} 
      >
        <DownloadIcon />
        Download
      </button>
      <button
        type="button"
        className="action-btn"
        onClick={onClickExport} 
      >
        <DownloadIcon />
        Export
      </button>
    </>
  );
};