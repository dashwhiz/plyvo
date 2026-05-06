"use client";

import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import Trash from "@/components/icons/Trash";
import Stack from "@/components/layout/Stack";
import { usePoolFromQuery } from "@/hooks/usePoolFromQuery";
import { usePoolActions } from "@/hooks/usePools";
import { cn } from "@/lib/cn";
import { formatOptionCount } from "@/lib/format";
import { poolReadiness } from "@/lib/pool";
import { strings } from "@/strings";
import { MAX_OPTIONS } from "@/types";
import PoolHeader from "./PoolHeader";
import OptionRow from "./OptionRow";
import AddOptionInput from "./AddOptionInput";
import styles from "./PoolBuilderScreen.module.css";

const pickStatusClass = (
  reachedMax: boolean,
  ready: boolean,
): string | undefined => {
  if (reachedMax) return styles.statusWarn;
  if (ready) return styles.statusOk;
  return undefined;
};

export default function PoolBuilderScreen() {
  const router = useRouter();
  const { hydrated, pool } = usePoolFromQuery();
  const {
    updatePool,
    deletePool,
    addOption,
    updateOption,
    removeOption,
    reorderOptions,
  } = usePoolActions();

  if (!hydrated) {
    return (
      <AppShell>
        <Stack gap={8} pt={10}>
          <Logo size="md" />
        </Stack>
      </AppShell>
    );
  }

  if (!pool) {
    return (
      <AppShell>
        <Stack gap={8} pt={10}>
          <Logo size="md" />
          <p className={styles.notFound}>{strings.home.emptyTitle}</p>
        </Stack>
      </AppShell>
    );
  }

  const readiness = poolReadiness(pool);
  const reachedMax = pool.options.length >= MAX_OPTIONS;

  const statusLabel = (() => {
    if (!readiness.ok && readiness.reason === "min")
      return strings.pool.minOptions;
    if (reachedMax) return strings.pool.maxOptions;
    return formatOptionCount(pool.options.length);
  })();

  const statusClass = pickStatusClass(reachedMax, readiness.ok);

  const handleDelete = () => {
    if (!confirm(strings.pool.deleteConfirm)) return;
    deletePool(pool.id);
    router.push("/");
  };

  return (
    <AppShell>
      <Stack gap={6} pt={8}>
        <Logo size="md" />

        <PoolHeader
          title={pool.title}
          icon={pool.icon}
          onTitleChange={(title) => updatePool(pool.id, { title })}
          onIconChange={(icon) => updatePool(pool.id, { icon })}
        />

        <Stack gap={2}>
          {pool.options.map((option, index) => (
            <OptionRow
              key={option.id}
              option={option}
              isFirst={index === 0}
              isLast={index === pool.options.length - 1}
              onChange={(name) => updateOption(pool.id, option.id, { name })}
              onMoveUp={() => reorderOptions(pool.id, index, index - 1)}
              onMoveDown={() => reorderOptions(pool.id, index, index + 1)}
              onRemove={() => removeOption(pool.id, option.id)}
            />
          ))}
        </Stack>

        <AddOptionInput
          disabled={reachedMax}
          onAdd={(name) => addOption(pool.id, { name })}
        />

        <div className={cn(styles.statusRow, statusClass)}>
          <span>{statusLabel}</span>
          <span>
            {pool.options.length}/{MAX_OPTIONS}
          </span>
        </div>

        {readiness.ok && (
          <Button
            fullWidth
            onClick={() => router.push(`/pool/mode?id=${pool.id}`)}
          >
            {strings.pool.continueCta}
          </Button>
        )}

        <button
          type="button"
          className={styles.deleteBtn}
          onClick={handleDelete}
        >
          <Trash />
          {strings.pool.deletePool}
        </button>
      </Stack>
    </AppShell>
  );
}
