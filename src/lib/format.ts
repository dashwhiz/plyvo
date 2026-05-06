import { strings } from "@/strings";

export const formatOptionCount = (count: number): string =>
  count === 1
    ? strings.pool.optionCountOne
    : strings.pool.optionCountMany.replace("{count}", String(count));
