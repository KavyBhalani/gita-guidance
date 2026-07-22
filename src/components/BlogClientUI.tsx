"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function BlogBackButton() {
  const { t } = useLanguage();
  return (
    <Link href="/blog" className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors mb-8">
      <ArrowLeft className="w-4 h-4" />
      {t.blog?.backToBlog || "Back to Blog"}
    </Link>
  );
}

export function BlogAuthorLabel() {
  const { t } = useLanguage();
  return <span>{t.blog?.byTeam || "By The Gita Guidance Team"}</span>;
}
