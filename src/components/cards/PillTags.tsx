type PillTagsProps = {
  tags: string[];
  /** Extra overflow count, e.g. +4 */
  extraCount?: number;
  className?: string;
  tagClassName?: string;
};

export function PillTags({
  tags,
  extraCount,
  className = "cardbox-tags",
  tagClassName,
}: PillTagsProps) {
  if (!tags.length && !extraCount) return null;

  return (
    <div className={className}>
      {tags.map((tag, index) => (
        <span className={tagClassName} key={`${tag}-${index}`}>
          {tag}
        </span>
      ))}
      {extraCount && extraCount > 0 ? (
        <span className={tagClassName}>+{extraCount}</span>
      ) : null}
    </div>
  );
}
