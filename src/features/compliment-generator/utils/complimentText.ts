import type { ComplimentItem } from '../../../types/compliment';

/**
 * The text that should be copied to the clipboard for a given compliment.
 * Once a compliment has been escalated, copying includes BOTH the original
 * and the escalated version (separated by a blank line) rather than just
 * the escalated one, so nothing gets lost.
 */
export function getComplimentCopyText(item: ComplimentItem): string {
  if (item.escalation?.escalated) {
    return `${item.escalation.original}\n\n${item.escalation.escalated}`;
  }
  return item.text;
}
