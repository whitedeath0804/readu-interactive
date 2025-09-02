// app/(tabs)/lessons/[lessonsId].tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import Markdown from "react-native-markdown-display";
import MathView from "react-native-math-view";

import { Colors } from "@/constants/Colors";
import { Typo } from "@/constants/Typography";
import SegmentedPicker from "@/components/ui/SegmentedPicker";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

// -------- Примерни данни за урок (без видео и без .md файл) --------
type Exercise = { question: string; options: string[]; correct: number };
type LessonCfg = {
  title: string;
  exercises: Exercise[];
};

const LESSONS: Record<string, LessonCfg> = {
  Calc_Ep23: {
    title: "Калкулус Еп. 23 — Неопределени форми и правило на Л'Опитал",
    exercises: [
      {
        question: "Колко е границата: (x² − 1)/(x − 1) при x → 1?",
        options: ["0", "1", "2", "∞"],
        correct: 2, // 2
      },
      {
        question: "Кое твърдение е вярно за lim_{x→0} sin x / x ?",
        options: ["Равна е на 0", "Не съществува", "Равна е на 1", "Равна е на 2"],
        correct: 2,
      },
    ],
  },
  limits1: {
    title: "Какво са граници?",
    exercises: [
      {
        question: "Намерете стойността: x³ + 4x² при x = 2",
        options: ["12", "28", "43", "63"],
        correct: 1,
      },
      {
        question: "Намерете стойността: x³ + 4x² при x = 3",
        options: ["39", "63", "81", "108"],
        correct: 1,
      },
    ],
  },
};

// -------- Имитирано Markdown съдържание (по ID) --------
const MD_FALLBACK_BY_ID: Record<string, string> = {
  Calc_Ep23: `
# Неопределени форми и правило на Л'Опитал

В този урок преговаряме класическите неопределени форми като \`0/0\` и \`∞/∞\`,
и показваме кога и как се прилага правилото на Л'Опитал.

> **Интуиция:** ако \`f(x)\` и \`g(x)\` клонят към 0 (или ∞), често границата на \`f/g\` може да се
> „разреши“ чрез производни:  
> $$\lim_{x\\to a}\\frac{f(x)}{g(x)} = \lim_{x\\to a}\\frac{f'(x)}{g'(x)},$$
> при подходящи условия за \`f\` и \`g\` (диференцируемост, ненулев знаменател около точката и т.н.).

## Бързи примери

1. Полиноми (алгебрична опростяване):
   $$\\lim_{x\\to 1} \\frac{x^2 - 1}{x - 1}
     = \\lim_{x\\to 1} \\frac{(x-1)(x+1)}{x-1} = 2.$$

2. Тригонометрични граници:
   $$\\lim_{x\\to 0} \\frac{\\sin x}{x} = 1.$$

3. Л'Опитал (0/0):
   $$\\lim_{x\\to 0} \\frac{\\sin x - x}{x^3}
     = \\lim_{x\\to 0} \\frac{\\cos x - 1}{3x^2}
     = \\lim_{x\\to 0} \\frac{-\\sin x}{6x}
     = \\lim_{x\\to 0} \\frac{-\\cos x}{6} = -\\frac{1}{6}.$$

## Типични грешки
- Прилагане на Л'Опитал без да е налице неопределена форма.
- Пропускане да се провери дали знаменателят остава различен от 0 в околност.
- Забравяне, че може първо да се опрости алгебрично и **чак тогава** да се мисли за Л'Опитал.

---

### Мини обобщение
- Потърси алгебрично опростяване.
- Ако имаш \`0/0\` или \`∞/∞\`, провери условията и при нужда приложи Л'Опитал.
- Помни класическите лимити: $\\lim\\limits_{x\\to 0} \\sin x / x = 1$.
`,
  limits1: `
# Граници — интуитивно въведение

Границата описва към **коя стойност** се стреми функцията, когато \`x\` се доближава до дадена точка.

## Дефиниция (идея)
Казваме, че $$\\lim_{x\\to a} f(x) = L,$$ ако можем да направим $f(x)$ **толкова близо** до $L$, колкото пожелаем, като вземем $x$ **достатъчно близо** до $a$.

## Примери
- $$\\lim_{x\\to 1} (3x+2) = 5.$$
- $$\\lim_{x\\to 0} \\frac{\\sin x}{x} = 1.$$

## Свойства
- Линейност: $$\\lim (af + bg) = a\\lim f + b\\lim g.$$
- Произведение/частно: $$\\lim (fg) = (\\lim f)(\\lim g), \\quad
\\lim (f/g) = (\\lim f)/(\\lim g),\\ g\\neq 0.$$

> **Съвет:** ако можеш — опрости първо алгебрично.

---
`,
};

// fallback по подразбиране
const DEFAULT_MD = `
# Добре дошъл в урока 👋

Това е временен markdown (имитация). Истинското съдържание ще бъде добавено скоро.

- Поддържаме **заглавия**, списъци и формули.
- Пример: $a^2 + b^2 = c^2$ и
$$\\int_0^1 x^2\\,dx = \\frac{1}{3}.$$
`;

// -------- Предобработка за LaTeX в Markdown --------
type MathBlock = { type: "block" | "inline"; content: string };

function preprocessMarkdown(content: string) {
  const mathBlocks: MathBlock[] = [];
  let processed = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, m) => {
    mathBlocks.push({ type: "block", content: m.trim() });
    return `<<MATH_BLOCK_${mathBlocks.length - 1}>>`;
  });
  processed = processed.replace(/\$([^$]+?)\$/g, (_, m) => {
    mathBlocks.push({ type: "inline", content: m.trim() });
    return `<<MATH_INLINE_${mathBlocks.length - 1}>>`;
  });
  return { processedContent: processed, mathBlocks };
}

function renderProcessedMarkdown(content: string, mathBlocks: MathBlock[]) {
  const parts = content.split(/(<<MATH_(BLOCK|INLINE)_\d+>>)/g);
  return parts.map((part, i) => {
    const m = part.match(/<<MATH_(BLOCK|INLINE)_(\d+)>>/);
    if (m) {
      const type = (m[1].toLowerCase() as "block" | "inline");
      const idx = parseInt(m[2], 10);
      const block = mathBlocks[idx];
      return (
        <MathView
          key={`math-${i}`}
          math={block.content}
          style={type === "block" ? styles.mathBlock : styles.mathInline}
        />
      );
    }
    return (
      <Markdown key={`md-${i}`} style={markdownStyles}>
        {part}
      </Markdown>
    );
  });
}

// -------- Екран --------
export default function LessonScreen() {
  const { lessonsId } = useLocalSearchParams<{ lessonsId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState(0); // 0 Урок, 1 Упражнение

  const lesson = useMemo<LessonCfg | null>(() => {
    if (lessonsId && LESSONS[lessonsId]) return LESSONS[lessonsId];
    const first = Object.values(LESSONS)[0];
    return first ?? null;
  }, [lessonsId]);

  // Markdown (имитация)
  const [mdProcessed, setMdProcessed] =
    useState<{ processedContent: string; mathBlocks: MathBlock[] } | null>(null);

  useEffect(() => {
    const key = String(lessonsId);
    const raw =
      (key && MD_FALLBACK_BY_ID[key]) ??
      MD_FALLBACK_BY_ID.limits1 ??
      DEFAULT_MD;
    setMdProcessed(preprocessMarkdown(raw));
  }, [lessonsId]);

  // Exercises
  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const qTotal = lesson?.exercises.length ?? 0;
  const current = lesson?.exercises[qIndex];

  function next() {
    if (!lesson) return;
    if (qIndex + 1 < lesson.exercises.length) {
      setQIndex((i) => i + 1);
      setSelected(null);
    } else {
      setStarted(false);
      setQIndex(0);
      setSelected(null);
    }
  }

  if (!lesson) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={[Typo.h2, { color: "#fff", padding: 16 }]}>
          Няма намерен урок.
        </Text>
        <PrimaryButton label="Назад" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={["#0b1020", "#05070d"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
          {/* Tabs */}
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <SegmentedPicker
              segments={[
                { key: "lesson", label: "Урок" },       // ясно, няма видео
                { key: "exercise", label: "Упражнение" },
              ]}
              index={tab}
              onChange={setTab}
              size="md"
            />
          </View>

          {tab === 0 ? (
            // ---------- Урок ----------
            <View style={styles.section}>
              <Text style={[Typo.h2, styles.title]}>{lesson.title}</Text>
              <View style={styles.card}>
                {mdProcessed
                  ? renderProcessedMarkdown(
                      mdProcessed.processedContent,
                      mdProcessed.mathBlocks
                    )
                  : null}
              </View>
            </View>
          ) : (
            // ---------- Упражнение ----------
            <View style={styles.section}>
              {!started ? (
                <View
                  style={[
                    styles.card,
                    {
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 48,
                    },
                  ]}
                >
                  <PrimaryButton
                    label="Започни упражнението"
                    onPress={() => setStarted(true)}
                  />
                </View>
              ) : current ? (
                <>
                  <View style={styles.headerRow}>
                    <Text
                      style={[
                        Typo.caption,
                        { color: (Colors as any)?.muted ?? "#9BA3AF", opacity: 0.9 },
                      ]}
                    >
                      {qIndex + 1} от {qTotal}
                    </Text>
                  </View>

                  <View style={styles.card}>
                    <Text style={[Typo.h4, { color: "#fff", marginBottom: 16 }]}>
                      {current.question}
                    </Text>

                    {current.options.map((opt, i) => {
                      const isSelected = selected === i;
                      return (
                        <Pressable
                          key={i}
                          onPress={() => setSelected(i)}
                          style={[
                            styles.optionRow,
                            isSelected && styles.optionSelected,
                          ]}
                        >
                          <View style={styles.bullet}>
                            <Text style={styles.bulletText}>
                              {String.fromCharCode(65 + i)}
                            </Text>
                          </View>
                          <Text style={styles.optionText}>{opt}</Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <View style={styles.footerRow}>
                    <SecondaryButton label="Пропусни" onPress={next} />
                    <PrimaryButton
                      label="Напред"
                      onPress={next}
                      disabled={selected === null}
                    />
                  </View>
                </>
              ) : null}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ---------- Стилове ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  section: { paddingHorizontal: 16, paddingTop: 12 },
  title: { color: "#fff", marginTop: 12, marginBottom: 8 },
  card: {
    backgroundColor: "rgba(20,20,20,0.9)",
    borderRadius: 18,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.08)",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  footerRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  optionSelected: {
    borderColor: (Colors as any)?.primary ?? "#FF8A3D",
    backgroundColor: "rgba(255,138,61,0.08)",
  },
  bullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  bulletText: { color: "#fff", fontWeight: "600" },
  optionText: { color: "#fff", ...Typo.body1 },
  mathBlock: { marginVertical: 10 },
  mathInline: { marginVertical: 2 },
});

// Markdown стил за тъмен фон
const markdownStyles = {
  body: {
    color: "#e9e9e9",
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: { color: "#fff", fontSize: 22, marginBottom: 8 },
  heading2: { color: "#fff", fontSize: 20, marginTop: 12, marginBottom: 6 },
  strong: { fontWeight: "700" },
  em: { fontStyle: "italic" },
} as const;
