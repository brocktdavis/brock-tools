import { createRoot } from "react-dom/client";

import './style.css';
import { Content } from "./Main";

const WORD_SPAN_SELECTOR = "span.u_word_dic";

export default defineContentScript({
  matches: ['*://korean.dict.naver.com/*'],
  cssInjectionMode: "ui",
  async main(ctx) {

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
        root.render(<Content />);
        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });

    ui.autoMount();
  },
});
