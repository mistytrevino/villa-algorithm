"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer, pageEnter } from "@/lib/motion";
import { coupleState, type Feature, type Islander } from "@/lib/types";
import { OracleBubble } from "@/components/OracleBubble";
import { LockedFeature } from "@/components/LockedFeature";
import { EpisodeTimeline } from "@/components/EpisodeTimeline";
import featuresData from "@/data/features.json";
import islandersData from "@/data/islanders.json";

const features = featuresData as Feature[];
const islanders = islandersData as Islander[];

// Hardcoded tonight, swapped for a live API call tomorrow. See kickoff Step 4.
const TONIGHT_PREDICTION =
  "Day one and the villa is already a powder keg. Aniya and KC look comfy, almost suspiciously so. Trinity and Bryce have chemistry you could bottle. But mark my words, there is a bombshell named Caleb sharpening his elbows. Somebody is getting their head turned by Friday. I am rooting for all of them. I am also rarely wrong.";

function rankIslanders(list: Islander[]): Islander[] {
  return [...list].sort((a, b) => {
    if (a.riskScore === null && b.riskScore === null) return 0;
    if (a.riskScore === null) return 1;
    if (b.riskScore === null) return -1;
    return b.riskScore - a.riskScore;
  });
}

export default function HomePage() {
  const ranked = rankIslanders(islanders);

  return (
    <motion.div
      variants={pageEnter}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-6xl px-6"
    >
      {/* Hero */}
      <section className="py-20 text-center">
        <span className="label">Love Island USA · Season 8</span>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-bold leading-tight text-cream sm:text-6xl">
          The Villa <span className="text-gold">Algorithm</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-body text-base text-muted">
          An AI watches the villa so you do not have to. Bold predictions, full
          receipts, zero chill. Built in public, one Claude skill at a time.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/oracle"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-body text-sm font-medium text-night transition-colors hover:bg-gold/90"
          >
            Ask the Oracle <ArrowRight size={16} />
          </Link>
          <Link
            href="/islanders"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-body text-sm font-medium text-cream transition-colors hover:border-white/30"
          >
            Meet the cast
          </Link>
        </div>
      </section>

      {/* Current Oracle prediction */}
      <section className="pb-16">
        <h2 className="mb-5 font-display text-3xl font-semibold text-cream">
          Tonight&apos;s call
        </h2>
        <OracleBubble
          message={TONIGHT_PREDICTION}
          model="Sonnet 4.6"
          timestamp="Episode 1"
        />
      </section>

      {/* Survival leaderboard */}
      <section className="pb-16">
        <h2 className="mb-5 font-display text-3xl font-semibold text-cream">
          Survival leaderboard
        </h2>
        <motion.ul
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="flex flex-col gap-2"
        >
          {ranked.map((islander, i) => {
            const state = coupleState(islander);
            return (
              <motion.li
                key={islander.id}
                variants={fadeUp}
                className="glass flex items-center justify-between !py-4"
              >
                <div className="flex items-center gap-4">
                  <span className="font-display text-lg font-semibold text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-cream">
                      {islander.name}
                    </p>
                    <p className="font-body text-xs capitalize text-muted">
                      {state === "coupled"
                        ? `Coupled with ${islander.partner}`
                        : state}
                    </p>
                  </div>
                </div>
                <span className="font-body text-sm text-muted">
                  {islander.riskScore === null
                    ? "Pending first scan"
                    : `${islander.riskScore}% risk`}
                </span>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>

      {/* Season timeline */}
      <section className="pb-16">
        <h2 className="mb-2 font-display text-3xl font-semibold text-cream">
          The season so far
        </h2>
        <p className="mb-6 font-body text-sm text-muted">
          Episodes unlock as they air. Aired episodes are confirmed. Future dates
          are estimates until Peacock locks them in.
        </p>
        <EpisodeTimeline />
      </section>

      {/* Unlock roadmap */}
      <section className="pb-24">
        <h2 className="mb-2 font-display text-3xl font-semibold text-cream">
          The unlock roadmap
        </h2>
        <p className="mb-6 font-body text-sm text-muted">
          Nine features. One new Claude skill each week. Watch the machine learn
          in public.
        </p>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) =>
            feature.unlocked ? (
              <motion.div key={feature.id} variants={fadeUp}>
                <Link href={feature.route} className="block h-full">
                  <article className="glass flex h-full flex-col gap-3 transition-colors hover:border-white/20">
                    <div>
                      <span className="label">Week {feature.week} · Live</span>
                      <h3 className="mt-1 font-display text-xl font-semibold text-cream">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="font-body text-sm text-muted">
                      {feature.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-1 font-body text-sm font-medium text-gold">
                      Open <ArrowRight size={14} />
                    </span>
                  </article>
                </Link>
              </motion.div>
            ) : (
              <LockedFeature
                key={feature.id}
                title={feature.title}
                description={feature.description}
                skill={feature.skill}
                skillCategory={feature.skillCategory}
                unlockDate={feature.unlockDate}
                week={feature.week}
              />
            )
          )}
        </motion.div>
      </section>
    </motion.div>
  );
}
