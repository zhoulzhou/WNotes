
export function debounce&lt;T extends (...args: any[]) =&gt; any&gt;(
  func: T,
  wait: number
): (...args: Parameters&lt;T&gt;) =&gt; void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters&lt;T&gt;) =&gt; {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() =&gt; func(...args), wait);
  };
}
