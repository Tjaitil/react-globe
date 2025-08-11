export const commonStyles = {
  button: {
    base: 'flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 rounded',
    primary:
      'bg-secondary-600 hover:bg-secondary-700 text-white active:scale-103',
    secondary:
      'bg-primary-600 hover:bg-primary-700 text-white active:scale-103',
    transparent: 'text-secondary-300 hover:text-white bg-transparent',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },

  card: {
    base: 'rounded-lg border transition-colors cursor-pointer',
    primary:
      'bg-secondary-800 border-secondary-600 hover:border-primary-500 hover:bg-secondary-700',
    elevated: 'bg-secondary-700 border-secondary-500 hover:border-primary-400',
  },
  input: {
    base: 'rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
    primary:
      'bg-secondary-600 border-secondary-500 text-white hover:bg-secondary-700',
  },

  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    sidebar: 'w-1/3 bg-secondary-800 p-4 text-white overflow-y-auto',
    main: 'flex-1 bg-secondary-900 p-4',
  },
} as const;

// Utility function to combine classes
export const cn = (
  ...classes: (string | undefined | false | null)[]
): string => {
  return classes.filter(Boolean).join(' ');
};

// Theme-aware utility functions
export const getButtonClasses = (
  variant: 'primary' | 'secondary' | 'transparent' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
  fullWidth = false,
  className?: string,
) => {
  return cn(
    commonStyles.button.base,
    commonStyles.button[variant],
    commonStyles.button.sizes[size],
    'cursor-pointer',
    fullWidth && 'w-full',
    className,
  );
};

export const getCardClasses = (
  variant: 'primary' | 'elevated' = 'primary',
  className?: string,
) => {
  return cn(commonStyles.card.base, commonStyles.card[variant], className);
};
