import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:     'bg-primary text-primary-foreground',
        secondary:   'bg-secondary text-secondary-foreground',
        destructive: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
        outline:     'border border-border text-foreground',
        success:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
        warning:     'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
        info:        'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
