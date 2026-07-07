"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { memo, useEffect, useMemo, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { InfoIcon } from "./icons";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Suggestion } from "./elements/suggestion";
import { ScrollArea } from "./ui/scroll-area";
import type { VisibilityType } from "./visibility-selector";

type SuggestedActionsProps = {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
  onSuggestionSelected?: () => void;
};

type StarterCategory = {
  id: "nation" | "geography" | "execution" | "calls";
  label: string;
  questions: readonly string[];
};

type DataInfoItem = {
  label: string;
  description: string;
};

const STARTER_QUESTION_CATEGORIES: readonly StarterCategory[] = [
  {
    id: "nation",
    label: "Nation",
    questions: [

      "Give me the total number of enrollments.",
      "Give me the total number of dispenses.",
      "How are my enrollments trending?",
      "How are dispenses trending?",
      "What is the split of enrollments by OLE vs. Non-OLE?",
      "What is the split of dispenses between Paid and Quick Start?"

    ],
  },
  {
    id: "geography",
    label: "Geography",
    questions: [

      "How do enrollments look across regions?",
      "How do enrollments look across areas?",
      "How does the dispenses contribution look by region?",
      "How does the dispenses contribution look by territory?",
      "How does the dispenses contribution look by area?",
      "Top 10 territories by number of enrollments."

    ],
  },

  {
    id: "execution",
    label: "Execution",
    questions: [

      "What is the reach across territories?",
      "What is the reach across pods?",
      "What is the reach across regions?",
      "What is the national reach?",
      "What is the reach across tiers?",
      "What is the national call frequency?"

    ],
  },
  // {
  //   id: "calls",
  //   label: "Calls",
  //   questions: [
  //     "What is the reach across different regions?",
  //     "What is the call frequency across different tiers?",
  //     "What are the average calls per day across different regions?",
  //     "What is the call effort across tiers by region?",
      
  //   ],
  // },
];

const DATA_INFO_ITEMS: readonly DataInfoItem[] = [
  {
    label: "ENROLLMENTS",
    description:
      "Tracks patient enrollment and HCP engagement activity across territories, updated through July 3, 2026.",
  },
  {
    label: "MARKETING_TARGET",
    description:
      "Highlights prioritized target HCPs for strategic commercial focus, as of Q2 2026.",
  },
  {
    label: "PARENT_MARKETING_TARGET",
    description:
      "Provides a parent account-level view of prioritized target health systems for strategic commercial focus, as of Q2 2026.",
  },
  {
    label: "SD_SHIPMENTS",
    description:
      "Captures specialty distributor shipment volumes by account and territory, updated through July 3, 2026.",
  },
  {
    label: "DISPENSE",
    description:
      "Records drug dispense transactions, including fills, refills, and dosage details, from the specialty pharmacies (Biologics and Orsini) and Hub (IQVIA), updated through July 3, 2026.",
  },
  {
    label: "CALLS_DATA",
    description:
      "Logs HCP call activity from the respective TSs and SAMs, updated through July 3, 2026.",
  },
];

function PureSuggestedActions({
  chatId,
  sendMessage,
  selectedVisibilityType,
  onSuggestionSelected,
}: SuggestedActionsProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    StarterCategory["id"] | null
  >(null);

  const selectedCategory = useMemo(
    () =>
      !selectedCategoryId
        ? null
        :
        STARTER_QUESTION_CATEGORIES.find(
          (category) => category.id === selectedCategoryId
        ) ?? null,
    [selectedCategoryId]
  );

  useEffect(() => {
    setSelectedCategoryId(null);
  }, [selectedVisibilityType]);

  const categoryQuestions = selectedCategory?.questions ?? [];

  const sendStarterQuestion = (suggestion: string) => {
    onSuggestionSelected?.();
    window.history.pushState({}, "", `/chat/${chatId}`);
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: suggestion }],
    });
  };

  return (
    <div className="w-full space-y-3" data-testid="suggested-actions">
      <p className="text-muted-foreground text-sm">
        Try asking questions related to...
      </p>

      <div className="flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="h-8 rounded-full border border-primary/20 bg-primary/8 px-3 text-primary shadow-sm hover:bg-primary/12 hover:text-primary"
              size="sm"
              variant="outline"
            >
              <InfoIcon size={14} />
              Data Info
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Data Info</DialogTitle>
              <DialogDescription>
                Quick definitions of the datasets powering the suggested questions.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-3">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <ul className="space-y-3 text-sm leading-relaxed text-foreground">
                  {DATA_INFO_ITEMS.map((item) => (
                    <li key={item.label} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="font-semibold tracking-wide">
                          {item.label}
                        </strong>{" "}
                        <span className="text-muted-foreground">— {item.description}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {STARTER_QUESTION_CATEGORIES.map((category) => {
          const isActive = category.id === selectedCategoryId;
          return (
            <Button
              className="h-8 rounded-full px-3"
              key={category.id}
              onClick={() => {
                setSelectedCategoryId((currentCategoryId) =>
                  currentCategoryId === category.id ? null : category.id
                );
              }}
              aria-pressed={isActive}
              size="sm"
              variant={isActive ? "default" : "outline"}
            >
              {category.label}
            </Button>
          );
        })}
      </div>

      {!!selectedCategory && (
        <div className="grid w-full gap-2 sm:grid-cols-2">
          {categoryQuestions.map((suggestedAction) => (
            <div className="h-full" key={`${selectedCategory.id}-${suggestedAction}`}>
              <Suggestion
                className="h-full min-h-[76px] w-full items-start justify-start whitespace-normal rounded-2xl px-4 py-2.5 text-left"
                onClick={sendStarterQuestion}
                suggestion={suggestedAction}
                title={suggestedAction}
                variant="outline"
              >
                <div className="line-clamp-3 text-sm leading-relaxed">{suggestedAction}</div>
              </Suggestion>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) {
      return false;
    }
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType) {
      return false;
    }

    return true;
  }
);
