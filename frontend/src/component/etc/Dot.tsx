export function Dot({ className, fill }: { className: string; fill?: string }) {
  return (
    <svg className={className} viewBox="0 0 8 8">
      <circle cx="4" cy="4" r="4" fill={fill} />
    </svg>
  );
}
