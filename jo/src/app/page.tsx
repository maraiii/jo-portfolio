"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { ReactLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

type CardProps = {
  title: string;
  copy: string;
  video?: string;
  index: number;
};

const Card = ({ title, copy, video, index }: CardProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    const handlePlay = () => {
      const allVideos = document.querySelectorAll("video");
      allVideos.forEach((vid) => {
        if (vid !== currentVideo) {
          vid.pause();
        }
      });
    };

    currentVideo.addEventListener("play", handlePlay);

    const scrollTrigger = ScrollTrigger.create({
      trigger: currentVideo,
      start: "top bottom",
      end: "bottom top",
      onLeave: () => {
        if (!currentVideo.paused) currentVideo.pause();
      },
      onLeaveBack: () => {
        if (!currentVideo.paused) currentVideo.pause();
      },
    });

    return () => {
      currentVideo.removeEventListener("play", handlePlay);
      scrollTrigger.kill();
    };
  }, []);

  return (
    <div className="card" id={`card-${index + 1}`}>
      <div className="card-inner">
        <div className="card-content">
          <h1>{title}</h1>
          <p>{copy}</p>
        </div>
        <div className="card-video">
          {video ? (
            <video ref={videoRef} controls loop>
              <source src={`/video/${video}`} type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          ) : (
            <p>Vídeo em breve...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const cards = [
    {
      title: "Cantata de natal Colégio Inter Ação",
      copy: "Uma noite em que os alunos do fundamental I do Colégio Inter Ação se reuniram em um evento na qual eles cantariam músicas que celebram o natal.",
      video: "card-2.mp4",
    },
    {
      title: "Casamento Bruna e Johannes",
      copy: "Vídeo de uma cerimônia de casamento do início ao fim, com making of, entrada dos padrinhos, matrimônio e a festa.",
      video: "card-2.mp4",
    },
    {
      title: "Festa Kvsh",
      copy: "Vídeo de uma festa com a música comandada pelo DJ Kvsh.",
      video: "card-2.mp4",
    },
    {
      title: "Mostra Científica Colégio Inter Ação",
      copy: "Evento do Colégio Inter Ação na qual os alunos do Ensino Médio se juntaram para apresentar seus projetos científicos para as famílias visitantes.",
      video: "card-2.mp4",
    },
    {
      title: "Noite de autógrafos",
      copy: "Um evento na qual os alunos do fundamental I do Colégio Inter Ação autografaram livros escritos por eles mesmos para seus familiares.",
      video: "card-2.mp4",
    },
    {
      title: "Palestra Bullying e Diversidade",
      copy: "A psicóloga Cândida Senna apresentou para os alunos do Fundamental I do Colégio Inter Ação uma palestra sobre a diversidade nas escolas e as consequências do bullying para os alunos.",
      video: "card-3.mp4",
    },
  ];

  const container = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".card");

      cards.forEach((card, index) => {
        const isLastCard = index === cards.length - 1;
        const cardInner = card.querySelector(".card-inner");

        if (!isLastCard && cardInner) {
          ScrollTrigger.create({
            trigger: card,
            start: "top top+=100",
            endTrigger: ".outro",
            end: "top 65%",
            pin: true,
            pinSpacing: false,
          });

          gsap.to(cardInner, {
            y: `-${(cards.length - index) * 14}vh`,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top top+=100",
              endTrigger: ".outro",
              end: "top 65%",
              scrub: true,
            },
          });
        }
      });
    },
    { scope: container }
  );

  useEffect(() => {
    // Animação para o fundo da página
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, backgroundColor: "#fff" },
        {
          opacity: 1,
          backgroundColor: "#000",
          duration: 2,
          ease: "power3.out",
        }
      );
    }

    if (textRef.current) {
      const words = textRef.current.querySelectorAll("span");
      gsap.fromTo(
        words,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.7,
          duration: 0.8,
          ease: "power2.out",
        }
      );
    }
  }, []);

  const sentence = [
    { text: "Focus.", color: "#fffff4" },
    { text: "Illuminate.", color: "#8cbdf8" },
    { text: "Transform.", color: "#8d7cee" },
  ];
  return (
    <ReactLenis root>
      <div className="app" ref={container}>
        <section className="hero" ref={heroRef}>
          <h1 ref={textRef}>
            {sentence.map((word, index) => (
              <span
                key={index}
                style={{
                  color: word.color,
                  marginRight: index < sentence.length - 1 ? "8px" : "0px",
                }}
              >
                {word.text}
              </span>
            ))}
          </h1>
        </section>
        <section className="intro">
          <h1>
            Criando vídeos de destaque para startups que trazem alegria e deixam
            impressões duradouras.
          </h1>
        </section>
        <section className="cards">
          {cards.map((card, index) => (
            <Card key={index} {...card} index={index} />
          ))}
        </section>
        <section className="outro">
          <h1>Vamos contar histórias duradouras juntos.</h1>
          <a
            href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="whatsapp-button">
              Fale comigo pelo WhatsApp
            </button>
          </a>
        </section>
      </div>
    </ReactLenis>
  );
}
