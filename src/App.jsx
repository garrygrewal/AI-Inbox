import { useEffect, useRef, useState } from "react";

const MAX_COMPOSER_HEIGHT = 240;
const COMPOSER_VERTICAL_PADDING = 32;
const MESSAGE_BOTTOM_PADDING = 8;
const SEND_BUTTON_HEIGHT = 40;
const MAX_TEXTAREA_HEIGHT =
  MAX_COMPOSER_HEIGHT - COMPOSER_VERTICAL_PADDING - MESSAGE_BOTTOM_PADDING - SEND_BUTTON_HEIGHT;
const MIN_SCROLL_THUMB_HEIGHT = 24;
const AUTO_REPLY_THINKING_DURATION = 4000;
const AUTO_REPLY_SENDING_DURATION = 4000;
const AUTO_REPLY_BANNER_TRANSITION_DURATION = 220;
const SUGGESTED_MESSAGE =
  "Lorem consequat occaecat aute eu exercitation voluptate qui eu mollit est eiusmod enim velit reprehenderit excepteur";
const RECEIVED_MESSAGE_SAMPLE =
  "Cupidatat enim tempor mollit reprehenderit ex anim aliquip fut labore irure officia labore excepteur amet velit fugiat dolore consequat adipisicing exercitation cillum non non tempor";
const SENT_MESSAGE_SAMPLE =
  "Cupidatat enim tempor mollit reprehenderit ex anim aliquip fut labore irure officia labore excepteur amet velit fugiat dolore consequat adipisicing exercitation cillum non non tempor";
const AI_AUTO_REPLY_MESSAGE_SAMPLE =
  "Cupidatat enim tempor mollit reprehenderit ex anim aliquip fut labore irure officia labore excepteur amet velit fugiat dolore consequat adipisicing exercitation cillum non non tempor";
const AUTO_REPLY_BANNER_ICON =
  "https://www.figma.com/api/mcp/asset/2b7f406c-e30b-4965-be82-1eecf9448fe4";
const AI_AUTO_REPLY_META_ICON =
  "https://www.figma.com/api/mcp/asset/e6893d0c-e99a-4a94-8b42-24a57d2ae0d8";
const AI_AUTO_REPLY_FEEDBACK_ICON =
  "https://www.figma.com/api/mcp/asset/c4d4b747-4bba-42a1-bca9-2f346280c0d2";
const SUGGESTION_FEEDBACK_THUMBS_UP_ICON =
  "https://www.figma.com/api/mcp/asset/b9101bca-8c47-48d5-8d7d-be069f116a4e";
const SUGGESTION_FEEDBACK_THUMBS_DOWN_ICON =
  "https://www.figma.com/api/mcp/asset/ef45e002-507c-4480-add7-6407a8a506b5";
const PHASE_OPTIONS = [
  { id: "phase-1", label: "Phase 1" },
  { id: "phase-2", label: "Phase 2" },
  { id: "phase-3", label: "Phase 3" },
];

function PhaseSegmentControl({ value, onChange, ariaLabel }) {
  return (
    <div className="phase-segment-control" role="tablist" aria-label={ariaLabel}>
      {PHASE_OPTIONS.map((phase) => {
        const isActive = phase.id === value;
        return (
          <button
            key={phase.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`phase-segment-button${isActive ? " phase-segment-button--active" : ""}`}
            onClick={() => onChange(phase.id)}
          >
            {phase.label}
          </button>
        );
      })}
    </div>
  );
}

function ChatMessagePrototype({ phase }) {
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const aiMenuRef = useRef(null);
  const showAiAutoReplyMessage = phase === "phase-3";
  const aiMenuOptions = [
    { icon: "copy", label: "Copy", useApolloIcon: true },
    { icon: "compose-2", label: "Draft Follow-up", useApolloIcon: true },
    { icon: AI_AUTO_REPLY_FEEDBACK_ICON, label: "Provide Feedback", useApolloIcon: false },
  ];

  useEffect(() => {
    if (!showAiAutoReplyMessage) {
      setIsAiMenuOpen(false);
    }
  }, [showAiAutoReplyMessage]);

  useEffect(() => {
    if (!isAiMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!aiMenuRef.current?.contains(event.target)) {
        setIsAiMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsAiMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAiMenuOpen]);

  return (
    <div
      className="chat-message-prototype"
      aria-label={`Chat message prototype ${PHASE_OPTIONS.find((p) => p.id === phase)?.label ?? phase}`}
    >
      <div className="chat-message-thread">
        <div className="chat-message chat-message--received">
          <div className="chat-message-bubble chat-message-bubble--received">
            <p className="chat-message-text">{RECEIVED_MESSAGE_SAMPLE}</p>
          </div>
          <p className="chat-message-timestamp">9:41 AM</p>
        </div>
        <div className="chat-message chat-message--sent">
          <div className="chat-message-bubble chat-message-bubble--sent">
            <p className="chat-message-text chat-message-text--inverse">{SENT_MESSAGE_SAMPLE}</p>
          </div>
          <p className="chat-message-timestamp chat-message-timestamp--sent">
            Delivered • Sent by Garry • 10:12 AM
          </p>
        </div>
        {showAiAutoReplyMessage ? (
          <div className="chat-message chat-message--sent chat-message--ai-auto-reply">
            <div className="chat-message-action-row">
              <div className="chat-message-action-control" ref={aiMenuRef}>
                <button
                  type="button"
                  className={`chat-message-menu-trigger${isAiMenuOpen ? " chat-message-menu-trigger--open" : ""}`}
                  aria-label="Open AI auto-reply message actions"
                  aria-expanded={isAiMenuOpen}
                  aria-haspopup="menu"
                  onClick={() => setIsAiMenuOpen((isOpen) => !isOpen)}
                >
                  <xpl-icon icon="dots-vertical" size="16"></xpl-icon>
                </button>
                {isAiMenuOpen ? (
                  <div className="chat-message-menu" role="menu">
                    {aiMenuOptions.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        className="chat-message-menu-item"
                        role="menuitem"
                        onClick={() => setIsAiMenuOpen(false)}
                      >
                        {option.useApolloIcon ? (
                          <xpl-icon
                            className="chat-message-menu-icon"
                            icon={option.icon}
                            size="20"
                          ></xpl-icon>
                        ) : (
                          <img
                            className="chat-message-menu-icon chat-message-menu-icon--img"
                            src={option.icon}
                            alt=""
                          />
                        )}
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="chat-message-action-main">
                <div className="chat-message-bubble chat-message-bubble--ai-auto-reply">
                  <p className="chat-message-text">{AI_AUTO_REPLY_MESSAGE_SAMPLE}</p>
                </div>
                <div className="chat-message-meta-row chat-message-meta-row--sent">
                  <span>Delivered • Sent by AI</span>
                  <img className="chat-message-meta-icon" src={AI_AUTO_REPLY_META_ICON} alt="" />
                  <span>• 9:47 AM</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function getAutoReplyBannerLabel(status) {
  return status === "sending" ? "AI is sending a reply..." : "AI is thinking...";
}

function MessageComposer({
  placeholder = "Type your message...",
  phase = "phase-1",
}) {
  const [value, setValue] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isAutoReplyEnabled, setIsAutoReplyEnabled] = useState(false);
  const [autoReplyStatus, setAutoReplyStatus] = useState("idle");
  const [isAutoReplyBannerTransitioning, setIsAutoReplyBannerTransitioning] = useState(false);
  const [previousAutoReplyBannerLabel, setPreviousAutoReplyBannerLabel] = useState("");
  const [hasGeneratedSuggestion, setHasGeneratedSuggestion] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollThumbStyle, setScrollThumbStyle] = useState({
    height: MIN_SCROLL_THUMB_HEIGHT,
    transform: "translateY(0px)",
  });
  const textareaRef = useRef(null);
  const suggestionTimeoutRef = useRef(null);
  const autoReplyThinkingTimeoutRef = useRef(null);
  const autoReplySendingTimeoutRef = useRef(null);
  const autoReplyBannerTransitionTimeoutRef = useRef(null);
  const previousValueRef = useRef("");
  const previousGeneratedSuggestionRef = useRef(false);
  const previousAutoReplyStatusRef = useRef("idle");
  const isPhaseThree = phase === "phase-3";
  const showSuggestAction = phase === "phase-2" || phase === "phase-3";
  const showAutoReplyBanner = isPhaseThree && autoReplyStatus !== "idle";
  const autoReplyBannerLabel = getAutoReplyBannerLabel(autoReplyStatus);
  const showSuggestionFeedback = showSuggestAction && hasGeneratedSuggestion && !isSuggesting;
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

  const cancelSuggestMessageFlow = () => {
    if (suggestionTimeoutRef.current) {
      window.clearTimeout(suggestionTimeoutRef.current);
      suggestionTimeoutRef.current = null;
    }

    setValue(previousValueRef.current);
    setHasGeneratedSuggestion(previousGeneratedSuggestionRef.current);
    setIsSuggesting(false);
  };

  const handleSuggestMessage = () => {
    if (isSuggesting) return;

    if (suggestionTimeoutRef.current) {
      window.clearTimeout(suggestionTimeoutRef.current);
    }

    resetAutoReplyFlow();
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

    blurActiveElement();
    cancelSuggestMessageFlow();
  };

  const clearAutoReplyThinkingTimeout = () => {
    if (autoReplyThinkingTimeoutRef.current) {
      window.clearTimeout(autoReplyThinkingTimeoutRef.current);
      autoReplyThinkingTimeoutRef.current = null;
    }
  };

  const clearAutoReplySendingTimeout = () => {
    if (autoReplySendingTimeoutRef.current) {
      window.clearTimeout(autoReplySendingTimeoutRef.current);
      autoReplySendingTimeoutRef.current = null;
    }
  };

  const clearAutoReplyBannerTransitionTimeout = () => {
    if (autoReplyBannerTransitionTimeoutRef.current) {
      window.clearTimeout(autoReplyBannerTransitionTimeoutRef.current);
      autoReplyBannerTransitionTimeoutRef.current = null;
    }
  };

  const resetAutoReplyFlow = () => {
    clearAutoReplyThinkingTimeout();
    clearAutoReplySendingTimeout();
    clearAutoReplyBannerTransitionTimeout();
    setIsAutoReplyEnabled(false);
    setAutoReplyStatus("idle");
    setIsAutoReplyBannerTransitioning(false);
    setPreviousAutoReplyBannerLabel("");
  };

  const handleAutoReplyToggle = () => {
    blurActiveElement();

    if (isAutoReplyEnabled) {
      resetAutoReplyFlow();
      return;
    }

    if (isSuggesting) {
      cancelSuggestMessageFlow();
    }

    clearAutoReplyThinkingTimeout();
    clearAutoReplySendingTimeout();
    setIsAutoReplyEnabled(true);
    setAutoReplyStatus("thinking");
    setIsAutoReplyBannerTransitioning(false);

    autoReplyThinkingTimeoutRef.current = window.setTimeout(() => {
      setAutoReplyStatus("sending");
      autoReplyThinkingTimeoutRef.current = null;
    }, AUTO_REPLY_THINKING_DURATION);

    autoReplySendingTimeoutRef.current = window.setTimeout(() => {
      resetAutoReplyFlow();
    }, AUTO_REPLY_THINKING_DURATION + AUTO_REPLY_SENDING_DURATION);
  };

  const handleTakeOver = () => {
    if (!showAutoReplyBanner) return;

    blurActiveElement();
    resetAutoReplyFlow();
  };

  const handleInputChange = (event) => {
    if (isPhaseThree && isAutoReplyEnabled) {
      resetAutoReplyFlow();
    }

    setValue(event.target.value);
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
    const previousStatus = previousAutoReplyStatusRef.current;

    if (
      previousStatus !== autoReplyStatus &&
      previousStatus !== "idle" &&
      autoReplyStatus !== "idle"
    ) {
      setPreviousAutoReplyBannerLabel(getAutoReplyBannerLabel(previousStatus));
      setIsAutoReplyBannerTransitioning(true);
      clearAutoReplyBannerTransitionTimeout();
      autoReplyBannerTransitionTimeoutRef.current = window.setTimeout(() => {
        setIsAutoReplyBannerTransitioning(false);
        setPreviousAutoReplyBannerLabel("");
        autoReplyBannerTransitionTimeoutRef.current = null;
      }, AUTO_REPLY_BANNER_TRANSITION_DURATION);
    } else if (autoReplyStatus === "idle") {
      setIsAutoReplyBannerTransitioning(false);
      setPreviousAutoReplyBannerLabel("");
      clearAutoReplyBannerTransitionTimeout();
    }

    previousAutoReplyStatusRef.current = autoReplyStatus;
  }, [autoReplyStatus]);

  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        window.clearTimeout(suggestionTimeoutRef.current);
      }

      if (autoReplyThinkingTimeoutRef.current) {
        window.clearTimeout(autoReplyThinkingTimeoutRef.current);
      }

      if (autoReplySendingTimeoutRef.current) {
        window.clearTimeout(autoReplySendingTimeoutRef.current);
      }

      if (autoReplyBannerTransitionTimeoutRef.current) {
        window.clearTimeout(autoReplyBannerTransitionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="composer-stack">
      <div className="composer-suggestion-feedback-slot" aria-live="polite">
        <div
          className={`composer-suggestion-feedback${showSuggestionFeedback ? " composer-suggestion-feedback--visible" : ""}`}
        >
          <p className="composer-suggestion-feedback-label">
            Was this suggested message helpful?
          </p>
          <div className="composer-suggestion-feedback-actions" role="group" aria-label="Suggested message feedback">
            <button
              type="button"
              className="composer-suggestion-feedback-button"
              aria-label="Thumbs up suggested message"
              tabIndex={showSuggestionFeedback ? 0 : -1}
            >
              <img
                className="composer-suggestion-feedback-icon"
                src={SUGGESTION_FEEDBACK_THUMBS_UP_ICON}
                alt=""
              />
            </button>
            <button
              type="button"
              className="composer-suggestion-feedback-button"
              aria-label="Thumbs down suggested message"
              tabIndex={showSuggestionFeedback ? 0 : -1}
            >
              <img
                className="composer-suggestion-feedback-icon"
                src={SUGGESTION_FEEDBACK_THUMBS_DOWN_ICON}
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`composer-ai-banner-slot${showAutoReplyBanner ? " composer-ai-banner-slot--visible" : ""}`}
        aria-hidden={showAutoReplyBanner ? undefined : true}
      >
        <div className="composer-ai-banner-clip">
          <div
            className="composer-ai-banner"
            aria-live={showAutoReplyBanner ? "polite" : undefined}
            role={showAutoReplyBanner ? "status" : undefined}
          >
            <div className="composer-ai-banner-copy">
              <img
                className="composer-ai-banner-icon"
                src={AUTO_REPLY_BANNER_ICON}
                alt=""
              />
              <span
                className={`composer-ai-banner-label-stack${isAutoReplyBannerTransitioning ? " composer-ai-banner-label-stack--transitioning" : ""}`}
              >
                {isAutoReplyBannerTransitioning && previousAutoReplyBannerLabel ? (
                  <span className="composer-ai-banner-label composer-ai-banner-label--outgoing">
                    {previousAutoReplyBannerLabel}
                  </span>
                ) : null}
                <span
                  className={`composer-ai-banner-label${isAutoReplyBannerTransitioning ? " composer-ai-banner-label--incoming" : ""}`}
                >
                  {autoReplyBannerLabel}
                </span>
              </span>
            </div>
            <button
              type="button"
              className="composer-ai-banner-takeover"
              aria-label="Take over and stop AI auto-reply"
              onClick={handleTakeOver}
              tabIndex={showAutoReplyBanner ? 0 : -1}
            >
              Take over
            </button>
          </div>
        </div>
      </div>
      <div
        className={`composer-card${isSuggesting ? " composer-card--suggesting" : ""}${isPhaseThree ? " composer-card--phase-3" : ""}`}
      >
        {isPhaseThree ? (
          <div className="composer-phase-header">
            <div className="composer-phase-header-info">
              <xpl-tooltip
                className="composer-phase-header-tooltip"
                text="Allow AI to automatically reply to eligible incoming messages."
                position="top-right"
              >
                <xpl-icon
                  icon="circle-info"
                  size="16"
                  aria-label="About AI auto-reply"
                ></xpl-icon>
              </xpl-tooltip>
              <span className="composer-phase-header-title xpl-text-title-5">AI auto-reply</span>
            </div>
            <div className="composer-phase-toggle-align">
              <xpl-toggle
                key={isAutoReplyEnabled ? "ai-auto-reply-on" : "ai-auto-reply-off"}
                className="composer-phase-toggle"
                name="ai-auto-reply"
                checked={isAutoReplyEnabled ? true : undefined}
                onClick={handleAutoReplyToggle}
              ></xpl-toggle>
            </div>
          </div>
        ) : null}
        <form
          className={`composer-shell${showSuggestAction ? " composer-shell--phase-2" : ""}${isPhaseThree ? " composer-shell--phase-3" : ""}`}
          aria-label="Message composer preview"
          onSubmit={handleSubmit}
        >
          <div className="composer-body-stack">
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
                    onChange={handleInputChange}
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
    </div>
  );
}

export default function App() {
  const [activePhase, setActivePhase] = useState("phase-1");
  const [chatMessagePhase, setChatMessagePhase] = useState("phase-1");

  return (
    <main className="app-shell">
      <p className="app-spec-title">Mariana Tek AI Inbox Spec</p>
      <div className="app-prototypes-column">
        <section
          className="prototype-shell"
          aria-labelledby="composer-section-title"
        >
          <div className="prototype-shell-intro">
            <h1 className="prototype-section-title" id="composer-section-title">
              Message Composer
            </h1>
            <PhaseSegmentControl
              value={activePhase}
              onChange={setActivePhase}
              ariaLabel="Composer phases"
            />
          </div>

          <MessageComposer key={activePhase} phase={activePhase} />
        </section>

        <section
          className="prototype-shell"
          aria-labelledby="chat-message-section-title"
        >
          <div className="prototype-shell-intro">
            <h1 className="prototype-section-title" id="chat-message-section-title">
              Chat Message
            </h1>
            <PhaseSegmentControl
              value={chatMessagePhase}
              onChange={setChatMessagePhase}
              ariaLabel="Chat message phases"
            />
          </div>

          <ChatMessagePrototype key={chatMessagePhase} phase={chatMessagePhase} />
        </section>
      </div>
      <p className="app-spec-footer-label">test figma-cursor spec template file</p>
    </main>
  );
}
