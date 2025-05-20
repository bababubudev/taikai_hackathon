import Image from "next/image";
import Link from "next/link";

function Main() {
  return (
    <main
      className="hero min-h-screen overflow-hidden relative"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/hero/main_hero.webp"
          alt="Nature landscape showing clean environment"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-base-100/80 select-none" aria-hidden="true"></div>

      <div className="hero-content text-center z-10">
        <div className="max-w-md space-y-16">
          <h1 id="hero-heading" className="text-5xl md:text-6xl lg:text-7xl font-bold">
            <span className="tracking-tighter font-extralight">MONITOR</span>
            <br />
            <span>
              YOUR ENVIRONMENT
            </span>
          </h1>

          <p className="text-xl">
            Track environmental factors affecting your health and get personalized recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mx-16 justify-center">
            <Link
              href="/dashboard"
              className="btn btn-primary"
              aria-label="Go to your environmental health dashboard"
            >
              View Dashboard &#8599;
            </Link>

            <Link
              href="/about"
              className="btn btn-outline"
              aria-label="Learn more about Zephyr"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Main;