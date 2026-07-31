export const formatSalary = (amount?: number | null): string => {
  if (amount === undefined || amount === null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatSalaryRange = (min?: number | null, max?: number | null): string => {
  if (!min && !max) return 'Not disclosed';
  if (min && max) return `${formatSalary(min)} - ${formatSalary(max)}`;
  if (min) return `From ${formatSalary(min)}`;
  if (max) return `Up to ${formatSalary(max)}`;
  return 'Not disclosed';
};
