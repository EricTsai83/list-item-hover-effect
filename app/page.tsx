import { HoverList } from './components/hover-list';

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-20 px-4 pb-20 pt-10 sm:gap-28 sm:px-6 sm:pb-24 sm:pt-12 md:gap-32 md:pt-16">
      <HoverList />
    </main>
  );
}
