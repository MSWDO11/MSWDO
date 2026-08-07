export function formatPeso(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getSectorColor(sector: string): string {
  switch (sector) {
    case 'Senior Citizen':
      return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    case 'PWD':
      return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    case 'Solo Parent':
      return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
    case 'Indigent / 4Ps':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    case 'Women & VAWC':
      return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    case 'Child & Youth':
      return 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}

export function getStatusBadge(status: string): { bg: string; text: string } {
  switch (status) {
    case 'Disbursed':
    case 'Approved for Payment':
    case 'Completed':
    case 'Active':
      return { bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300', text: status };
    case 'Under Evaluation':
    case 'In Desk':
    case 'Active Response':
      return { bg: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300', text: status };
    case 'Pending Intake':
    case 'Waiting':
      return { bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300', text: status };
    case 'Declined':
    case 'At Capacity':
      return { bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300', text: status };
    default:
      return { bg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300', text: status };
  }
}
