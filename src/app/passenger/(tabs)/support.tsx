import { useMemo, useRef, useState, type ComponentRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";

import { SupportComposer } from "@/components/passenger/support/SupportComposer";
import { SupportConversationCard } from "@/components/passenger/support/SupportConversationCard";
import { SupportMessageBubble } from "@/components/passenger/support/SupportMessageBubble";
import {
  SupportSuggestions,
  type SupportSuggestion,
} from "@/components/passenger/support/SupportSuggestions";
import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field } from "@/components/ui/Field";
import { Screen } from "@/components/ui/Screen";
import { Section } from "@/components/ui/Section";
import { Segmented } from "@/components/ui/Segmented";
import { Skeleton } from "@/components/ui/Skeleton";
import { showToast } from "@/components/ui/Toast";
import {
  useSendSupportMessage,
  useStartSupportConversation,
  useSupportConversation,
  useSupportConversations,
} from "@/lib/queries/supportQueries";

type SupportTab = "ask" | "conversations";

/** The suggestion prompts are interactive UI chrome (not seed content), so they
 * go through `t()` like every other label and stay in locale parity. */
const SUGGESTION_KEYS = ["q1", "q2", "q3", "q4"] as const;

export default function PassengerSupportScreen() {
  const { t } = useTranslation();

  const [tab, setTab] = useState<SupportTab>("ask");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  /** The just-sent message, shown optimistically until the thread refetches. */
  const [pending, setPending] = useState<string | null>(null);

  const conversationsQuery = useSupportConversations();
  const activeQuery = useSupportConversation(activeId ?? undefined);
  const startConversation = useStartSupportConversation();
  const sendMessage = useSendSupportMessage(activeId ?? "");

  const sending = startConversation.isPending || sendMessage.isPending;
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);

  const suggestions: SupportSuggestion[] = useMemo(
    () => SUGGESTION_KEYS.map((key) => ({ id: key, question: t(`support.${key}`) })),
    [t],
  );

  const conversations = useMemo(() => conversationsQuery.data ?? [], [conversationsQuery.data]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter(
      (thread) =>
        thread.topic.toLowerCase().includes(term) ||
        thread.messages.some((message) => message.text.toLowerCase().includes(term)),
    );
  }, [conversations, search]);

  const messages = activeId ? activeQuery.data?.messages ?? [] : [];

  // Show the optimistic bubble until the refetched thread actually carries the
  // sent message, so the chat never flashes empty between the two.
  const showPending =
    pending !== null && !messages.some((message) => message.sender === "user" && message.text === pending);

  function send(text: string) {
    const value = text.trim();
    if (!value || sending) return;
    setDraft("");
    setPending(value);
    if (activeId) {
      sendMessage.mutate(value);
    } else {
      startConversation.mutate(value, {
        onSuccess: (conversation) => {
          if (conversation) setActiveId(conversation.id);
        },
      });
    }
  }

  function startNewConversation() {
    setActiveId(null);
    setDraft("");
    setPending(null);
    setTab("ask");
  }

  function openConversation(id: string) {
    setActiveId(id);
    setPending(null);
    setTab("ask");
  }

  return (
    <Screen scroll={false}>
      <AppHeader title={t("support.title")} subtitle={t("support.subtitle")} showBack={false} />

      <View className="px-4 mb-3">
        <Segmented<SupportTab>
          value={tab}
          onChange={setTab}
          options={[
            { label: t("support.tabAsk"), value: "ask" },
            { label: t("support.tabConversations"), value: "conversations" },
          ]}
        />
      </View>

      {tab === "ask" ? (
        <View className="flex-1">
          <ScrollView
            ref={scrollRef}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="px-4 pb-2"
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            <Text className="text-2xl font-bold text-text">{t("support.chatTitle")}</Text>
            <Text className="text-base text-secText mt-1 mb-4 leading-5">
              {t("support.chatIntro")}
            </Text>

            {activeId ? (
              messages.map((message) => (
                <SupportMessageBubble key={message.id} message={message} />
              ))
            ) : (
              <SupportMessageBubble
                message={{ id: "greeting", sender: "assistant", text: t("support.greeting"), at: "" }}
              />
            )}

            {showPending ? (
              <SupportMessageBubble
                message={{ id: "pending", sender: "user", text: pending as string, at: "" }}
              />
            ) : null}
          </ScrollView>

          <KeyboardStickyView>
            <View className="pt-3 border-t border-border">
              <Text className="text-2xs font-semibold text-muted text-center mb-2.5 px-4">
                {t("support.suggestionsHint")}
              </Text>
              <SupportSuggestions suggestions={suggestions} onSelect={send} />
            </View>
            <SupportComposer
              value={draft}
              onChangeText={setDraft}
              onSend={() => send(draft)}
              onAttach={() => showToast("info", t("support.attach"), t("support.attachToast"))}
              sending={sending}
            />
          </KeyboardStickyView>
        </View>
      ) : (
        <View className="flex-1">
          <View className="px-4">
            <Text className="text-2xl font-bold text-text">{t("support.conversationsTitle")}</Text>
            <Text className="text-base text-secText mt-1 mb-3 leading-5">
              {t("support.conversationsSubtitle")}
            </Text>
            <Field
              icon="search"
              placeholder={t("support.searchPlaceholder")}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <ScrollView
            className="flex-1 mt-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="px-4 pb-6 gap-2.5"
          >
            <Section title={t("support.previous")} className="mt-0 mb-1" />

            {conversationsQuery.isLoading ? (
              <View className="gap-2.5">
                {[0, 1, 2].map((key) => (
                  <Skeleton key={key} className="h-20 rounded-lg" />
                ))}
              </View>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={search.trim() ? "search-off" : "chat-bubble-outline"}
                title={search.trim() ? t("support.noResults") : t("support.emptyTitle")}
                message={search.trim() ? undefined : t("support.emptyBody")}
              />
            ) : (
              filtered.map((conversation) => (
                <SupportConversationCard
                  key={conversation.id}
                  conversation={conversation}
                  onPress={() => openConversation(conversation.id)}
                />
              ))
            )}
          </ScrollView>

          <View className="px-4 py-3 border-t border-border bg-card">
            <AppButton
              label={t("support.newQuestion")}
              icon="edit"
              iconPosition="left"
              onPress={startNewConversation}
            />
          </View>
        </View>
      )}
    </Screen>
  );
}
