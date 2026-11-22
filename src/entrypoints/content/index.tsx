import { createRoot } from "react-dom/client";
import { downloadAudioBlob, downloadAudioToBlob } from "@/utils/audioDownload";
import { createAnkiNote } from "@/utils/createAnkiCard";
import { ActionButton } from "@/components/ActionButton";

import './style.css';

const WORD_SPAN_SELECTOR = "span.u_word_dic";

export default defineContentScript({
  matches: ['*://korean.dict.naver.com/*'],
  cssInjectionMode: "ui",
  async main(ctx) {
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
    }

    const ui = await createShadowRootUi(ctx, {
      name: "download-audio-button",
      position: "inline",
      anchor: WORD_SPAN_SELECTOR,
      append: "after", // render as the next sibling of the site's button
      onMount(container, _shadow, shadowHost) {
        const parent = shadowHost.parentElement;
        if (parent) {
          parent.style.setProperty('display', 'inline-flex', 'important');
          parent.style.setProperty('align-items', 'center', 'important');
          parent.style.setProperty('gap', '0.75rem');
        }
        container.classList.add('export-container');

        const root = createRoot(container);
        root.render(
          <>
            <ActionButton action={downloadAudio} label="Audio" />
            <ActionButton action={exportToNote} label="Export" />
          </>
        );
        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });

    ui.autoMount();
  },
});
