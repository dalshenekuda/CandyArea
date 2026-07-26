import {Button, Text} from '@dalshenekuda/candy-ui';
import {Link} from 'react-router';

export function HeroSection() {
  return (
    <section className="hero-section" data-tone="blueras">
      <div className="hero-section-inner">
        <div className="hero-copy">
          <Text
            variant="display-2xl"
            balance
            color="tone-ink"
            className="hero-headline"
          >
            Sweets with a loud character
          </Text>
          <Text variant="body-lg" color="tone-ink" className="hero-description">
            Real candy shop on custom Hydrogen — pick, add, and checkout without
            leaving the grid.
          </Text>
          <div className="hero-actions">
            <Button asChild size="xl">
              <Link to="/collections/all">Shop all</Link>
            </Button>
            <Link to="/collections/candy-v1">
              <Text variant="meta-md" color="tone-ink">
                Best sellers →
              </Text>
            </Link>
          </div>
          <Text variant="meta-sm" color="tone-ink" className="hero-meta">
            42+ SKUs · Ships in 1–2 days · No palm oil
          </Text>
        </div>
        <div className="hero-visual">
          <img
            src="/images/hero-cluster-light.png"
            alt="Assorted colorful candies"
            className="hero-visual-img hero-visual-img--light"
            loading="eager"
            decoding="async"
          />
          <img
            src="/images/hero-cluster.png"
            alt="Assorted colorful candies"
            className="hero-visual-img hero-visual-img--dark"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
