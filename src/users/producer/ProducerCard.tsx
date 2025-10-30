import React from 'react';
import type {Producer} from "./producer.ts";

export const ProducerCard: React.FC<Producer> = (producer: Producer) => {
  const wines = producer.wines ?? [];

  const firstThree = wines.slice(0, 3);
  const names = firstThree.map(w => w.name).filter(Boolean);
  const remaining = wines.length - firstThree.length;

  const email = producer.email?.trim();
  const phone = producer.phone?.trim();
  const rawWebsite = producer.website?.trim();
  const hrefWebsite = rawWebsite ? (rawWebsite.startsWith("http") ? rawWebsite : `https://${rawWebsite}`) : undefined;
  const displayWebsite = rawWebsite ? rawWebsite.replace(/^https?:\/\//, '').replace(/\/$/, '') : undefined;
  const phoneHref = phone ? phone.replace(/[^\d+]/g, '') : undefined;

  return (
    <div className="border border-border p-3 rounded-xl flex flex-col justify-between shadow">
      <div className="space-y-3">
        <header className="mb-1" title={producer.name}>
          <h2 className="text-xl font-semibold text-textPrimary-1">
            {producer.name}
          </h2>
        </header>

        <div className="text-sm">
          <span className="font-semibold text-textPrimary-1">{`Current offerings: ${wines.length} ${wines.length === 1 ? 'wine' : 'wines'}`}</span>
          {names.length > 0 && (
            <span className="text-textSecondary">{` · ${names.join(', ')}${remaining > 0 ? ` +${remaining} more` : ''}`}</span>
          )}
        </div>

        <div className="text-md text-textSecondary">
          {producer.description ?? ""}
        </div>
      </div>

      {(email || phone || hrefWebsite) && (
        <footer className="mt-4 pt-3 border-t border-border text-sm text-textSecondary flex flex-col items-start gap-1">
          {hrefWebsite && (
            <a className="hover:underline" href={hrefWebsite} target="_blank" rel="noopener noreferrer">
              {displayWebsite}
            </a>
          )}
          {email && (
            <a className="hover:underline" href={`mailto:${email}`}>{email}</a>
          )}
          {phone && (
            <a className="hover:underline" href={`tel:${phoneHref ?? phone}`}>{phone}</a>
          )}
        </footer>
      )}
    </div>
  );
}