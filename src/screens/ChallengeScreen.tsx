import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { ai } from '../engine/ai';
import { CharacterPortrait } from '../components/CharacterPortrait';
import { AngledButton } from '../components/AngledButton';
import { RichText } from '../components/RichText';
import { ComicBurst } from '../components/ComicBurst';
import { Diagram } from '../components/Diagram';
import { ScrollCue } from '../components/ScrollCue';
import { useTypewriter } from '../hooks/useTypewriter';
import { sfx } from '../engine/sfx';
import type { ChoiceOption } from '../types';

type Msg = { role: 'you' | 'ai'; text: string };

export function ChallengeScreen() {
  const { edition, currentStage, completeChallenge } = useGame();
  const stage = currentStage();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [busy, setBusy] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [input, setInput] = useState('');
  const [pickedWrong, setPickedWrong] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // 会話が増えた/クリア時だけ最新へスクロール。初回は図や設問を頭から見せたいので動かさない。
  useEffect(() => {
    if (messages.length === 0 && !cleared) return;
    const el = rootRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, cleared]);

  if (!stage || !edition) return null;
  const ch = stage.challenge;
  const partner = edition.partner;

  const push = (m: Msg) => setMessages((prev) => [...prev, m]);

  async function handleChoice(opt: ChoiceOption) {
    if (busy || cleared) return;
    setBusy(true);
    push({ role: 'you', text: opt.text });
    const res = await ai.judgeChoice(ch, opt);
    push({ role: 'ai', text: res.response });
    if (res.ok) {
      setCleared(true);
      sfx.clear();
    } else {
      setAttempts((a) => a + 1);
      setPickedWrong((w) => [...w, opt.id]);
      sfx.error();
    }
    setBusy(false);
  }

  async function handleSend() {
    if (busy || cleared || input.trim().length === 0) return;
    setBusy(true);
    const text = input.trim();
    push({ role: 'you', text });
    setInput('');
    const res = await ai.judgeFreeText(ch, text);
    push({ role: 'ai', text: res.response });
    if (res.ok) {
      setCleared(true);
      sfx.clear();
    } else {
      setAttempts((a) => a + 1);
      if (res.nudge) push({ role: 'ai', text: `ヒント: ${res.nudge}` });
      sfx.error();
    }
    setBusy(false);
  }

  return (
    <motion.div
      ref={rootRef}
      className="screen challenge"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      {cleared && <ComicBurst label="達成" sub="QUEST CLEAR" />}
      <ScrollCue targetRef={rootRef} />

      {/* TOP: compact quest brief */}
      <aside className="ch__brief slab">
        <span className="chip">{ch.brief}</span>
        <div className="ch__partner-face">
          <CharacterPortrait variant={partner.portrait} accent={edition.accent} />
        </div>
        <p className="ch__goal">
          <RichText text={ch.goal} />
        </p>
        <button className="ch__hintbtn" onClick={() => setShowHint((v) => !v)}>
          {showHint ? '✕ 閉じる' : '？ ヒント'}
        </button>
        <AnimatePresence>
          {showHint && (
            <motion.p
              className="ch__hint"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <RichText text={ch.hint} />
              {ch.kind === 'freeText' && attempts >= 2 && ch.sampleAnswer && (
                <span className="ch__sample">お手本: 「{ch.sampleAnswer}」</span>
              )}
            </motion.p>
          )}
        </AnimatePresence>
      </aside>

      {/* RIGHT: chat + interaction */}
      <section className="ch__main">
        <div className="ch__log">
          {ch.diagram && <Diagram kind={ch.diagram} />}
          <div className="ch__qbubble">
            <CharacterPortrait variant={partner.portrait} accent={edition.accent} />
            <p><RichText text={ch.question ?? '自分の言葉で、AIに頼んでみよう。'} /></p>
          </div>

          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.text} partner={partner.portrait} accent={edition.accent} />
          ))}
          {busy && <div className="ch__typing">{partner.name} が考えている…</div>}
        </div>

        {/* input zone */}
        {!cleared && ch.kind === 'choice' && (
          <div className="ch__choices">
            {ch.options!.map((opt, i) => (
              <AngledButton
                key={opt.id}
                full
                badge={i + 1}
                sound="select"
                disabled={busy || pickedWrong.includes(opt.id)}
                onClick={() => handleChoice(opt)}
              >
                {opt.text}
              </AngledButton>
            ))}
          </div>
        )}

        {!cleared && ch.kind === 'freeText' && (
          <div className="ch__compose">
            <textarea
              className="ch__textarea"
              value={input}
              placeholder={ch.placeholder}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend();
              }}
              disabled={busy}
              rows={3}
            />
            <AngledButton onClick={handleSend} disabled={busy || input.trim().length === 0}>
              送る ▶
            </AngledButton>
          </div>
        )}

        {cleared && <ClearedBar onNext={() => completeChallenge(attempts + 1)} />}
      </section>
    </motion.div>
  );
}

function ChatBubble({
  role,
  text,
  partner,
  accent,
}: {
  role: 'you' | 'ai';
  text: string;
  partner: 'claude' | 'cursor' | 'mentor' | 'hero';
  accent: string;
}) {
  const { shown } = useTypewriter(text, { blip: role === 'ai' });
  return (
    <motion.div
      className={`bubble bubble--${role}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {role === 'ai' && (
        <div className="bubble__face">
          <CharacterPortrait variant={partner} accent={accent} />
        </div>
      )}
      <p><RichText text={shown} /></p>
    </motion.div>
  );
}

/** 達成バナー。品質％や試行回数は出さない（新方針：成績表ではなく達成の事実だけ） */
function ClearedBar({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      className="ch__cleared"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 240, damping: 18 }}
    >
      <span className="ch__cleared-tag display">依頼 達成</span>
      <AngledButton onClick={onNext}>つづける ▶</AngledButton>
    </motion.div>
  );
}
