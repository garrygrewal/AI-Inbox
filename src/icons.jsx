const CHAT_BOT_ICON_SRC = "/icons/chat-bot-fill-18.svg";

export function ChatBotIcon({ className }) {
  return <img className={className} src={CHAT_BOT_ICON_SRC} alt="" aria-hidden="true" />;
}

export function ThumbsUpIcon({ className }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.083 6.417V12.25H2.333C1.965 12.25 1.667 11.952 1.667 11.583V6.417C1.667 6.048 1.965 5.75 2.333 5.75H4.083V6.417Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.083 6.417L5.541 2.625C5.729 2.154 6.181 1.854 6.688 1.854H7.875C8.477 1.854 8.958 2.335 8.958 2.937V5.75H11.667C12.403 5.75 12.958 6.368 12.875 7.1L12.125 11.767C12.056 12.365 11.548 12.813 10.948 12.813H6.417C5.729 12.813 5.125 12.385 4.917 11.729L4.083 9.208V6.417Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThumbsDownIcon({ className }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.083 7.583V1.75H2.333C1.965 1.75 1.667 2.048 1.667 2.417V7.583C1.667 7.952 1.965 8.25 2.333 8.25H4.083V7.583Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.083 7.583L5.541 11.375C5.729 11.846 6.181 12.146 6.688 12.146H7.875C8.477 12.146 8.958 11.665 8.958 11.063V8.25H11.667C12.403 8.25 12.958 7.632 12.875 6.9L12.125 2.233C12.056 1.635 11.548 1.187 10.948 1.187H6.417C5.729 1.187 5.125 1.615 4.917 2.271L4.083 4.792V7.583Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
