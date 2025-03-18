export function checkDomain(
  hostname: string,
  allowedDomains: string[]
): boolean {
  return allowedDomains.some((domain) => {
    if (domain.startsWith("*.")) return hostname.endsWith(domain.slice(2));
    return hostname === domain;
  });
} 