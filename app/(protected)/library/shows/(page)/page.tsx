import { FeaturedShow } from './_components/featured-show';
import { ShowsFilter } from './_components/shows-filter';
import { ShowsGrid } from './_components/shows-grid';

export default function ShowsPage() {
  return (
    <>
      <FeaturedShow />
      <section>
        <ShowsFilter />
        <ShowsGrid />
      </section>
    </>
  );
}
