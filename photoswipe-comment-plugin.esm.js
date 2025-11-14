/**
 * photoswipe-comment-plugin.esm.js
 * ----------------------------------------
 * PhotoSwipe v5.x plugin that displays a comment string
 * (from data-pswp-comment) centered in the top bar.
 *
 * Usage:
 *   import PhotoSwipeCommentPlugin from './photoswipe-comment-plugin.esm.js';
 *   const comment = new PhotoSwipeCommentPlugin(lightbox, { options });
 *
 * Author: apptaro
 * License: MIT
 * Repository: https://github.com/apptaro/photoswipe-comment-plugin
 */

export default class PhotoSwipeCommentPlugin {
  /**
   * @param {PhotoSwipeLightbox} lightbox - PhotoSwipe lightbox instance
   * @param {Object} [options={}] - configuration options
   */
  constructor(lightbox, options = {}) {
    this.lightbox = lightbox;
    this.options = {
      attr: options?.attr ?? 'data-pswp-comment',
      getText: null,
      topBarHeight: options?.topBarHeight ?? 60,
      textColor: options?.textColor ?? '#ffffff',
      autoHideOnEmpty: options?.autoHideOnEmpty ?? true,
      maxWidthPct: options?.maxWidthPct ?? 70,
      minAspectRatioToShowBelowImage: options?.minAspectRatioToShowBelowImage ?? 1,
      classPrefix: options?.classPrefix ?? 'pswp-comment',
    };

    this._registerUI();
  }

  _registerUI() {
    const { lightbox, options: cfg } = this;

    const applyCSS = () => {
      const pswp = lightbox.pswp;
      const scopeId = `pswp-cm_${Math.random().toString(36).slice(2)}`;
      const scope = `[data-cm="${scopeId}"]`;
      const css = `
        ${scope} .${cfg.classPrefix}-top {
          position: absolute;
          top: 0px;
          left: 50%;
          transform: translateX(-50%);
          max-width: ${cfg.maxWidthPct}%;
          height: ${cfg.topBarHeight}px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${cfg.textColor};
          line-height: 1.2;
          overflow: hidden;
          pointer-events: none;
          @media (max-aspect-ratio: ${cfg.minAspectRatioToShowBelowImage}) { display: none; }
        }
        ${scope} .${cfg.classPrefix}-bottom {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, calc(-50% + var(--image-height) / 2));
          max-width: ${cfg.maxWidthPct}%;
          color: ${cfg.textColor};
          line-height: 1.2;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          pointer-events: none;
          @media (min-aspect-ratio: ${cfg.minAspectRatioToShowBelowImage}) { display: none; }
        }
      `;
      this._styleEl = document.createElement('style');
      this._styleEl.textContent = css;
      document.head.appendChild(this._styleEl);
      pswp.element.setAttribute('data-cm', scopeId);
    };

    const unapplyCSS = (pswp) => {
      pswp.element.removeAttribute('data-cm');
      if (this._styleEl) {
        document.head.removeChild(this._styleEl);
        this._styleEl = null;
      }
    };

    const resolveText = (pswp) => {
      const index = pswp.currIndex;
      const slide = pswp.currSlide;
      if (typeof cfg.getText === 'function') {
        return String(cfg.getText(pswp, index, slide) ?? '');
      } else {
        const elm = slide.data.element || slide.data.originalElement;
        if (elm) {
          const attrValue = elm.getAttribute(cfg.attr);
          if (attrValue) {
            return attrValue;
          }
        }
        if (typeof slide.data.comment === 'string') {
          return slide.data.comment;
        } else if (typeof slide.data.caption === 'string') {
          return slide.data.caption;
        } else {
          return '';
        }
      }
    };

    lightbox.on('uiRegister', () => {
      const pswp = lightbox.pswp;
      pswp.ui.registerElement({
        name: 'commentElementTop',
        className: cfg.classPrefix + '-top',
        appendTo: 'bar',
        onInit: (el, pswp) => {
          const updateText = () => {
            let txt = resolveText(pswp).trim();
            el.textContent = txt;
            if (cfg.autoHideOnEmpty) {
              el.style.display = txt ? '' : 'none';
            }
          };
          pswp.on('afterInit', updateText);
          pswp.on('change', updateText);
          pswp.on('destroy', () => {
            pswp.off('afterInit', updateText);
            pswp.off('change', updateText);
          });
        }
      });

      pswp.ui.registerElement({
        name: 'commentElementBottom',
        className: cfg.classPrefix + '-bottom',
        appendTo: 'root',
        onInit: (el, pswp) => {
          const updateText = () => {
            let txt = resolveText(pswp).trim();
            el.textContent = txt;
            if (cfg.autoHideOnEmpty) {
              el.style.display = txt ? '' : 'none';
            }
          };
          const updateSize = ({ content, width, height }) => {
            el.style.setProperty('--image-height', height + 'px');
          };

          pswp.on('afterInit', updateText);
          pswp.on('change', updateText);
          pswp.on('contentResize', updateSize);
          pswp.on('destroy', () => {
            pswp.off('afterInit', updateText);
            pswp.off('change', updateText);
            pswp.off('contentResize', updateSize);
          });
        }
      });
    });

    lightbox.on('afterInit', () => {
      const pswp = lightbox.pswp;
      applyCSS();
      pswp.on('destroy', () => {
        unapplyCSS(pswp);
      });
    });
  }
}
