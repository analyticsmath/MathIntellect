import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { models } from "./ModelData";
import { Photo } from "./Photo";
import { Arrow, TextLink } from "./Shared";

export function ModelRail() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 801px) and (prefers-reduced-motion: no-preference)",
        () => {
          const rail = root.current!;
          const row = track.current!;
          if (row.scrollWidth <= rail.clientWidth) return;
          const cards = Array.from(
            row.querySelectorAll<HTMLElement>(".mi-model-card"),
          );
          const distance = () =>
            Math.max(0, row.scrollWidth - rail.clientWidth);
          const travel = gsap.to(row, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              id: "mi-model-rail",
              trigger: rail,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.55,
              invalidateOnRefresh: true,
              onUpdate: ({ progress }) => {
                const center = progress * distance() + rail.clientWidth / 2;
                let nearest = 0;
                cards.forEach((card, index) => {
                  if (
                    Math.abs(card.offsetLeft + card.offsetWidth / 2 - center) <
                    Math.abs(
                      cards[nearest].offsetLeft +
                        cards[nearest].offsetWidth / 2 -
                        center,
                    )
                  )
                    nearest = index;
                });
                setActive(nearest);
              },
            },
          });
          cards.forEach((card) => {
            gsap.fromTo(
              card.querySelector("img"),
              { xPercent: -7, scale: 1.16 },
              {
                xPercent: 7,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: travel,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          });
        },
      );
      return () => media.revert();
    },
    { scope: root },
  );

  const select = (index: number) => {
    const row = track.current;
    const card = row?.children[index] as HTMLElement | undefined;
    if (!row || !card) return;
    const trigger = ScrollTrigger.getById("mi-model-rail");
    if (trigger) {
      const distance = row.scrollWidth - root.current!.clientWidth;
      const offset = Math.max(
        0,
        Math.min(
          distance,
          card.offsetLeft - (root.current!.clientWidth - card.offsetWidth) / 2,
        ),
      );
      window.dispatchEvent(
        new CustomEvent("mi:scroll-to", {
          detail:
            trigger.start +
            ((trigger.end - trigger.start) * offset) / Math.max(1, distance),
        }),
      );
    } else {
      row.scrollTo({
        left: card.offsetLeft - 22,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
    setActive(index);
  };

  return (
    <section
      ref={root}
      className="mi-model-rail"
      aria-labelledby="models-title"
    >
      <div className="mi-model-stage">
        <div className="mi-model-heading">
          <h2 id="models-title">Follow a possibility.</h2>
          <TextLink to="/models">Explore the models</TextLink>
        </div>
        <div
          ref={track}
          className="mi-model-track"
          onScroll={() => {
            if (!ScrollTrigger.getById("mi-model-rail") && track.current) {
              const row = track.current;
              const step = (row.children[0] as HTMLElement)?.offsetWidth + 20;
              setActive(
                Math.min(models.length - 1, Math.round(row.scrollLeft / step)),
              );
            }
          }}
        >
          {models.map((model, index) => (
            <Link
              key={model.id}
              className={`mi-model-card mi-model-card--${model.id}`}
              to={"/models#" + model.id}
              onFocus={() => select(index)}
            >
              <figure>
                <Photo
                  id={model.photo}
                  sizes={
                    model.photo === "glider"
                      ? "(max-width:800px) 210vw, 95vw"
                      : model.photo === "chess"
                        ? "(max-width:800px) 84vw, 65vw"
                        : "(max-width:800px) 170vw, 75vw"
                  }
                />
                <div className="mi-model-card-caption">
                  <h3>{model.name}</h3>
                  <p>{model.question}</p>
                </div>
                <span className="mi-photo-arrow">
                  <Arrow diagonal />
                </span>
              </figure>
              <div>
                <p>{model.summary}</p>
              </div>
            </Link>
          ))}
        </div>
        <nav className="mi-rail-navigation" aria-label="Browse models">
          {models.map((model, index) => (
            <button
              key={model.id}
              type="button"
              aria-pressed={index === active}
              onClick={() => select(index)}
            >
              <span>{model.name}</span>
              <i aria-hidden="true" />
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
