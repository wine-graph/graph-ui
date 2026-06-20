import type {MouseEvent, ReactElement, SVGProps} from "react";

export type ContactSocialLink = {
  provider?: string | null;
  url?: string | null;
};

type ContactLinksProps = {
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  social?: ContactSocialLink[] | null;
  className?: string;
  linkClassName?: string;
  onLinkClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

type IconProps = SVGProps<SVGSVGElement>;
type ContactIcon = (props: IconProps) => ReactElement;
type NormalizedSocialLink = {
  key: string;
  href: string;
  label: string;
  Icon: ContactIcon;
};

const iconClassName = "h-5 w-5";
const contactLinkClass = "text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] transition-colors";

const WebsiteIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const EmailIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2"/>
    <path d="m3 7 9 6 9-6"/>
  </svg>
);

const PhoneIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.34 1.9.65 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.65A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const FacebookIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M14 8.5h2.25V5.05A28.3 28.3 0 0 0 13 4.88c-3.22 0-5.43 1.97-5.43 5.58v3.14H4v3.86h3.57V24h4.37v-6.54h3.42l.54-3.86h-3.96v-2.76c0-1.12.31-2.34 2.06-2.34z"/>
  </svg>
);

const InstagramIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" stroke="none"/>
  </svg>
);

const XIcon = (props: IconProps) => (
  <svg viewBox="0 0 1200 1227" fill="none" {...props}>
    <path
      d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894L144.011 79.694h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
      fill="currentColor"
    />
  </svg>
);

const normalizeWebsite = (website: string): string => {
  const trimmed = website.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const providerMeta: Record<string, { label: string; Icon: ContactIcon }> = {
  FACEBOOK: {label: "Facebook", Icon: FacebookIcon},
  INSTAGRAM: {label: "Instagram", Icon: InstagramIcon},
  TWITTER: {label: "X / Twitter", Icon: XIcon},
  X: {label: "X / Twitter", Icon: XIcon},
};

const normalizeProvider = (provider?: string | null): string | null => {
  const normalized = provider?.trim().toUpperCase();
  if (!normalized) return null;
  return normalized in providerMeta ? normalized : null;
};

export const ContactLinks = ({
  website,
  email,
  phone,
  social,
  className = "",
  linkClassName = "",
  onLinkClick,
}: ContactLinksProps) => {
  const websiteUrl = website ? normalizeWebsite(website) : "";
  const emailValue = email?.trim() ?? "";
  const phoneValue = phone?.trim() ?? "";
  const phoneHref = phoneValue.replace(/[^\d+]/g, "");
  const socialLinks = (social ?? [])
    .map((link) => {
      const provider = normalizeProvider(link.provider);
      const url = link.url?.trim() ?? "";
      if (!provider || !url) return null;
      const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      return {key: `${provider}-${normalizedUrl}`, href: normalizedUrl, ...providerMeta[provider]};
    })
    .filter((link): link is NormalizedSocialLink => Boolean(link));

  if (!websiteUrl && !emailValue && !phoneHref && socialLinks.length === 0) return null;

  const mergedLinkClass = `${contactLinkClass} ${linkClassName}`.trim();

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${className}`.trim()}>
      {websiteUrl && (
        <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className={mergedLinkClass} onClick={onLinkClick} title="Visit website" aria-label="Visit website">
          <WebsiteIcon className={iconClassName} aria-hidden="true"/>
        </a>
      )}
      {emailValue && (
        <a href={`mailto:${emailValue}`} className={mergedLinkClass} onClick={onLinkClick} title="Send email" aria-label="Send email">
          <EmailIcon className={iconClassName} aria-hidden="true"/>
        </a>
      )}
      {phoneHref && (
        <a href={`tel:${phoneHref}`} className={mergedLinkClass} onClick={onLinkClick} title="Call" aria-label="Call">
          <PhoneIcon className={iconClassName} aria-hidden="true"/>
        </a>
      )}
      {socialLinks.map(({key, href, label, Icon}) => (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={mergedLinkClass} onClick={onLinkClick} title={label} aria-label={label}>
          <Icon className={iconClassName} aria-hidden="true"/>
        </a>
      ))}
    </div>
  );
};

export default ContactLinks;
