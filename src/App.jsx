import { useEffect, useRef, useState } from "react";

const MAX_COMPOSER_HEIGHT = 240;
const COMPOSER_VERTICAL_PADDING = 32;
const MESSAGE_BOTTOM_PADDING = 8;
const SEND_BUTTON_HEIGHT = 40;
const MAX_TEXTAREA_HEIGHT =
  MAX_COMPOSER_HEIGHT - COMPOSER_VERTICAL_PADDING - MESSAGE_BOTTOM_PADDING - SEND_BUTTON_HEIGHT;
const MIN_SCROLL_THUMB_HEIGHT = 24;
const SUGGESTED_MESSAGE =
  "Lorem consequat occaecat aute eu exercitation voluptate qui eu mollit est eiusmod enim velit reprehenderit excepteur";
const PHASE_OPTIONS = [
  { id: "phase-1", label: "Phase 1" },
  { id: "phase-2", label: "Phase 2" },
  { id: "phase-3", label: "Phase 3" },
];

function MessageComposer({
  placeholder = "Type your message...",
  phase = "phase-1",
}) {
  const [value, setValue] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [hasGeneratedSuggestion, setHasGeneratedSuggestion] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollThumbStyle, setScrollThumbStyle] = useState({
    height: MIN_SCROLL_THUMB_HEIGHT,
    transform: "translateY(0px)",
  });
  const textareaRef = useRef(null);
  const suggestionTimeoutRef = useRef(null);
  const previousValueRef = useRef("");
  const previousGeneratedSuggestionRef = useRef(false);
  const showSuggestAction = phase === "phase-2" || phase === "phase-3";
  const showDisclaimer = showSuggestAction && hasGeneratedSuggestion && !isSuggesting;
  const isSendDisabled = isSuggesting || value.length < 1;

  const blurActiveElement = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const updateScrollState = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const nextScrollable = textarea.scrollHeight > MAX_TEXTAREA_HEIGHT;
    setIsScrollable(nextScrollable);

    if (!nextScrollable) {
      setScrollThumbStyle({
        height: MIN_SCROLL_THUMB_HEIGHT,
        transform: "translateY(0px)",
      });
      return;
    }

    const visibleHeight = textarea.clientHeight;
    const scrollRange = textarea.scrollHeight - visibleHeight;
    const thumbHeight = Math.max(
      (visibleHeight / textarea.scrollHeight) * visibleHeight,
      MIN_SCROLL_THUMB_HEIGHT,
    );
    const trackTravel = visibleHeight - thumbHeight;
    const thumbOffset =
      scrollRange > 0 ? (textarea.scrollTop / scrollRange) * trackTravel : 0;

    setScrollThumbStyle({
      height: thumbHeight,
      transform: `translateY(${thumbOffset}px)`,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSendDisabled) return;
    setValue("");
    setHasGeneratedSuggestion(false);
  };

  const handleSuggestMessage = () => {
    if (isSuggesting) return;

    if (suggestionTimeoutRef.current) {
      window.clearTimeout(suggestionTimeoutRef.current);
    }

    blurActiveElement();
    previousValueRef.current = value;
    previousGeneratedSuggestionRef.current = hasGeneratedSuggestion;
    setValue("");
    setIsSuggesting(true);
    setHasGeneratedSuggestion(false);

    suggestionTimeoutRef.current = window.setTimeout(() => {
      setValue(SUGGESTED_MESSAGE);
      setIsSuggesting(false);
      setHasGeneratedSuggestion(true);
      suggestionTimeoutRef.current = null;
    }, 5000);
  };

  const handleCancelSuggestion = () => {
    if (!isSuggesting) return;

    if (suggestionTimeoutRef.current) {
      window.clearTimeout(suggestionTimeoutRef.current);
      suggestionTimeoutRef.current = null;
    }

    blurActiveElement();
    setValue(previousValueRef.current);
    setHasGeneratedSuggestion(previousGeneratedSuggestionRef.current);
    setIsSuggesting(false);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    const nextHeight = Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT);
    textarea.style.height = `${Math.max(nextHeight, 44)}px`;
    textarea.scrollTop = 0;
    updateScrollState();
  }, [value]);

  useEffect(() => {
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        window.clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="composer-stack">
      <div className="composer-disclaimer-slot" aria-live="polite">
        <p
          className={`composer-disclaimer${showDisclaimer ? " composer-disclaimer--visible" : ""}`}
        >
          AI can make mistakes. Review before sending.
        </p>
      </div>
      <form
        className={`composer-shell${showSuggestAction ? " composer-shell--phase-2" : ""}${isSuggesting ? " composer-shell--suggesting" : ""}`}
        aria-label="Message composer preview"
        onSubmit={handleSubmit}
      >
        <div className="composer-message-area">
          {isSuggesting ? (
            <div
              className="composer-loading-state"
              aria-live="polite"
              aria-busy="true"
              aria-label="Generating suggested message"
            >
              <xpl-skeleton
                class-names="composer-skeleton-line"
                height="20px"
                width="100%"
              ></xpl-skeleton>
              <xpl-skeleton
                class-names="composer-skeleton-line composer-skeleton-line--secondary"
                height="20px"
                width="100%"
              ></xpl-skeleton>
            </div>
          ) : (
            <>
              <label className="composer-input-label" htmlFor="message-composer-input">
                Message
              </label>
              <div className="composer-scroll-frame">
                <textarea
                  id="message-composer-input"
                  ref={textareaRef}
                  className={`composer-input${value ? " composer-input--filled" : ""}${isScrollable ? " composer-input--scrollable" : ""}`}
                  placeholder={placeholder}
                  rows="1"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  onScroll={updateScrollState}
                />
                {isScrollable ? (
                  <div className="composer-scrollbar" aria-hidden="true">
                    <div
                      className="composer-scrollbar-thumb"
                      style={scrollThumbStyle}
                    />
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
        <div className="composer-actions">
          {showSuggestAction ? (
            <div className="composer-suggest-button-shell">
              <div
                className={`composer-suggest-button-layer${isSuggesting ? "" : " composer-suggest-button-layer--active"}`}
              >
                <xpl-button
                  className="composer-suggest-button"
                  type="button"
                  variant="secondary"
                  size="sm"
                  aria-label="Suggest message"
                  onClick={handleSuggestMessage}
                >
                  <xpl-icon icon="add-magic" size="16"></xpl-icon>
                  Suggest Message
                </xpl-button>
              </div>
              <div
                className={`composer-suggest-button-layer${isSuggesting ? " composer-suggest-button-layer--active" : ""}`}
              >
                <xpl-button
                  className="composer-suggest-button"
                  type="button"
                  variant="secondary"
                  state="neutral"
                  size="sm"
                  aria-label="Cancel suggestion"
                  onClick={handleCancelSuggestion}
                >
                  Cancel
                </xpl-button>
              </div>
            </div>
          ) : (
            <span />
          )}
          <xpl-button
            type="submit"
            variant="primary"
            state="neutral"
            icon-only=""
            disabled={isSendDisabled ? true : undefined}
            aria-label="Send message"
          >
            <xpl-icon icon="arrow-up" size="20"></xpl-icon>
          </xpl-button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [activePhase, setActivePhase] = useState("phase-1");

  return (
    <main className="app-shell">
      <section className="prototype-shell" aria-label="Message composer prototype">
        <div
          className="phase-segment-control"
          role="tablist"
          aria-label="Composer phases"
        >
          {PHASE_OPTIONS.map((phase) => {
            const isActive = phase.id === activePhase;
            return (
              <button
                key={phase.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`phase-segment-button${isActive ? " phase-segment-button--active" : ""}`}
                onClick={() => setActivePhase(phase.id)}
              >
                {phase.label}
              </button>
            );
          })}
        </div>

        <MessageComposer key={activePhase} phase={activePhase} />
      </section>
    </main>
  );
}
