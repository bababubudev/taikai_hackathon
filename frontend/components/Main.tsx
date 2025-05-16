import Image from "next/image";
import Link from "next/link";

function Main() {
  return (
    <main
      className="hero min-h-screen overflow-hidden relative"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0">
        <Image
          src="/hero/main_hero.webp"
          alt="Hackathon hero image"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-base-100/80 select-none"></div>

      <div className="hero-content text-center z-10">
        <div className="max-w-md space-y-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
            <span className="tracking-tighter font-extralight">HELLO</span>
            <br />
            <span>
              WORLD
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 mx-16 justify-center">
            <Link href={"/details"} className="btn btn-primary">
              Go to details &#8599;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Main;