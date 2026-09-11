"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Send, UserRound } from "lucide-react";
import { apiFetch, getToken } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  bio?: string | null;
  demonstrated_skills?: string | null;
  created_at: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  sender: User;
  receiver: User;
}

interface Profile {
  id: number;
  full_name: string;
  email: string;
  department: string;
  bio?: string | null;
  created_at: string;
  projects_count: number;
  demonstrated_skills: {
    technology: string;
    project_count: number;
  }[];
}

export default function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const [userId, setUserId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    async function loadConversation(
      id: number,
      showLoading: boolean = false
    ) {
      try {
        if (showLoading) {
          setLoading(true);
        }

        const messagesData = await apiFetch<Message[]>(
          `/messages/${id}`
        );

        if (!cancelled) {
          setMessages(messagesData);
          setError("");
        }
      } catch (err) {
        console.error("Failed to load messages:", err);

        if (!cancelled && showLoading) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Unable to load this conversation.");
          }
        }
      } finally {
        if (!cancelled && showLoading) {
          setLoading(false);
        }
      }
    }

    async function loadPage() {
      try {
        const resolvedParams = await params;
        const id = Number(resolvedParams.userId);

        if (!id || Number.isNaN(id)) {
          setError("Invalid student profile.");
          setLoading(false);
          return;
        }

        setUserId(id);

        /*
         * Get the currently logged-in user's ID.
         *
         * The access token itself does not contain the user object
         * in this frontend, so we get the current user's information
         * from the /auth/me endpoint.
         */
        let loggedInUser: User;

        try {
          loggedInUser = await apiFetch<User>("/auth/me");
        } catch (authError) {
          console.error(
            "Could not identify current user:",
            authError
          );

          /*
           * If /auth/me is not available, we still allow the
           * conversation to load. Message alignment will fall
           * back to comparing sender and receiver IDs.
           */
          loggedInUser = {
            id: -1,
            name: "",
            email: "",
            department: "",
            created_at: "",
          };
        }

        if (!cancelled && loggedInUser.id !== -1) {
          setCurrentUserId(loggedInUser.id);
        }

        const profileData = await apiFetch<Profile>(
          `/users/${id}`
        );

        if (cancelled) {
          return;
        }

        setProfile(profileData);

        await loadConversation(id, true);

        if (!cancelled) {
          intervalId = setInterval(() => {
            loadConversation(id);
          }, 3000);
        }
      } catch (err) {
        console.error("Failed to load chat:", err);

        if (!cancelled) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Unable to load this conversation.");
          }

          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      cancelled = true;

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [params]);

  async function sendMessage() {
    const content = messageText.trim();

    if (!content || !userId || sending) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const newMessage = await apiFetch<Message>("/messages", {
        method: "POST",
        body: JSON.stringify({
          receiver_id: userId,
          content,
        }),
      });

      setMessages((previousMessages) => {
        /*
         * Prevent duplicate messages if the polling request
         * returns the newly created message immediately.
         */
        const alreadyExists = previousMessages.some(
          (message) => message.id === newMessage.id
        );

        if (alreadyExists) {
          return previousMessages;
        }

        return [...previousMessages, newMessage];
      });

      setMessageText("");
    } catch (err) {
      console.error("Failed to send message:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to send message.");
      }
    } finally {
      setSending(false);
    }
  }

  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function isOwnMessage(message: Message) {
    /*
     * Preferred method:
     * compare the message sender with the actual logged-in user.
     */
    if (currentUserId !== null && currentUserId !== -1) {
      return message.sender_id === currentUserId;
    }

    /*
     * Fallback:
     * if the current user could not be identified, the other
     * participant's ID is used.
     */
    return message.sender_id !== userId;
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--text-muted)" }}>
          Loading conversation...
        </p>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "2rem",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/home"
          className="btn-secondary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
          }}
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        <div
          className="glass-panel"
          style={{
            padding: "2rem",
            borderRadius: "14px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#f87171",
              marginBottom: "0.75rem",
            }}
          >
            Unable to open this conversation.
          </p>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/dashboard"
          className="btn-secondary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.25rem",
          }}
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </Link>

        <section
          className="glass-panel"
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            minHeight: "650px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: "1.25rem",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
            }}
          >
            <div
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <UserRound size={21} color="#ffffff" />
            </div>

            <div>
              <p
                style={{
                  color: "var(--primary-cyan)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  marginBottom: "0.2rem",
                }}
              >
                PROJECTFORGE / CHAT
              </p>

              <h1
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 750,
                }}
              >
                {profile?.full_name}
              </h1>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.78rem",
                }}
              >
                {profile?.department}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "1.25rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem",
              minHeight: "450px",
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                <div>
                  <Send
                    size={32}
                    style={{
                      color: "var(--text-subtle)",
                      marginBottom: "0.75rem",
                    }}
                  />

                  <p
                    style={{
                      fontWeight: 650,
                      marginBottom: "0.35rem",
                    }}
                  >
                    No messages yet
                  </p>

                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.85rem",
                    }}
                  >
                    Start the conversation.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const ownMessage = isOwnMessage(message);

                return (
                  <div
                    key={message.id}
                    style={{
                      display: "flex",
                      justifyContent: ownMessage
                        ? "flex-end"
                        : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "75%",
                        padding: "0.8rem 1rem",
                        borderRadius: "14px",
                        background: ownMessage
                          ? "rgba(14, 165, 233, 0.18)"
                          : "rgba(255, 255, 255, 0.06)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      {/* Sender name */}
                      <p
                        style={{
                          color: ownMessage
                            ? "var(--primary-cyan)"
                            : "var(--text-muted)",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          marginBottom: "0.3rem",
                        }}
                      >
                        {ownMessage
                          ? "You"
                          : message.sender.name}
                      </p>

                      {/* Message */}
                      <p
                        style={{
                          fontSize: "0.9rem",
                          lineHeight: 1.5,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {message.content}
                      </p>

                      {/* Time */}
                      <p
                        style={{
                          color: "var(--text-subtle)",
                          fontSize: "0.68rem",
                          marginTop: "0.4rem",
                        }}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "0.75rem 1.25rem",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <p
                style={{
                  color: "#f87171",
                  fontSize: "0.8rem",
                }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Message Input */}
          <div
            style={{
              padding: "1rem",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-end",
            }}
          >
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Write a message..."
              className="input-field"
              rows={2}
              style={{
                flex: 1,
                resize: "none",
              }}
              disabled={sending}
            />

            <button
              type="button"
              onClick={sendMessage}
              className="btn-primary"
              disabled={sending || !messageText.trim()}
              style={{
                minHeight: "44px",
              }}
            >
              {sending ? "Sending..." : "Send"}
              <Send size={15} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}