type SlugEntity = {
  slug?: string | null;
};

export function producerPath(producer: SlugEntity): string | undefined {
  const slug = producer.slug?.trim();
  return slug ? `/producer/${encodeURIComponent(slug)}` : undefined;
}

export function producerProfilePath(producer: SlugEntity): string | undefined {
  const basePath = producerPath(producer);
  return basePath ? `${basePath}/profile` : undefined;
}

export function producerCellarPath(producer: SlugEntity): string | undefined {
  const basePath = producerPath(producer);
  return basePath ? `${basePath}/cellar` : undefined;
}

export function winePath(wine: SlugEntity): string | undefined {
  const slug = wine.slug?.trim();
  return slug ? `/wine/${encodeURIComponent(slug)}` : undefined;
}
