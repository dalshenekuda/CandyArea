import {useLoaderData} from 'react-router';
import {MockShopNotice} from '~/components/MockShopNotice';
import {FeaturedProducts} from './FeaturedProducts';
import {HeroSection} from './HeroSection';

export function HomePage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home home-bleed">
      {data.isShopLinked ? null : <MockShopNotice />}
      <HeroSection />
      <FeaturedProducts collection={data.candyCollection} />
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/_index').loader>} LoaderReturnData */
