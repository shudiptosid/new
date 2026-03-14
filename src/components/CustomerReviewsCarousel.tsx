import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

type Review = {
  name: string;
  role: string;
  company: string;
  rating: number;
  review: string;
};

const reviews: Review[] = [
  {
    name: "Siam Rahman",
    role: "Founder",
    company: "Nexa AgroTech",
    rating: 5,
    review:
      "Circuit Crafters delivered our remote sensor prototype ahead of schedule. The hardware quality and documentation were excellent.",
  },
  {
    name: "Mim Akter",
    role: "Product Manager",
    company: "UrbanGrid Labs",
    rating: 5,
    review:
      "Their team simplified a complex IoT pipeline for us. We moved from unstable tests to production-ready builds in weeks.",
  },
  {
    name: "Tariq Hasan",
    role: "Operations Lead",
    company: "BluePulse Manufacturing",
    rating: 5,
    review:
      "Fast communication, practical engineering decisions, and a strong focus on reliability. Exactly what we needed for industrial deployment.",
  },
  {
    name: "Farzana Noor",
    role: "STEM Instructor",
    company: "FutureMinds Academy",
    rating: 5,
    review:
      "Our students loved the learning kits. The tutorials are clear, and support from the team has been consistently great.",
  },
  {
    name: "Rafid Chowdhury",
    role: "CTO",
    company: "AeroDock Systems",
    rating: 5,
    review:
      "From firmware optimization to board-level advice, their input reduced our iteration cycles and improved performance significantly.",
  },
  {
    name: "Nusrat Jahan",
    role: "Research Assistant",
    company: "Smart City Lab",
    rating: 5,
    review:
      "The team helped us build an end-to-end monitoring stack with stable telemetry and clean dashboards. Highly recommended.",
  },
  {
    name: "Arman Kabir",
    role: "Project Coordinator",
    company: "GreenGrid Energy",
    rating: 5,
    review:
      "Professional workflow, transparent updates, and robust prototypes. We now use their architecture as our baseline standard.",
  },
  {
    name: "Lamia Islam",
    role: "Hardware Engineer",
    company: "VoltBridge R&D",
    rating: 5,
    review:
      "Excellent practical insight on sensors and MCU selection. Their recommendations saved cost without sacrificing accuracy.",
  },
];

const AUTO_SCROLL_DELAY = 3400;

const CustomerReviewsCarousel = () => {
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: false,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedSnap(emblaApi.selectedScrollSnap());
    };

    const onInit = () => {
      setSnapCount(emblaApi.scrollSnapList().length);
      onSelect();
    };

    onInit();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onInit);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onInit);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // Move left-to-right by calling scrollPrev on an interval.
    const autoPlay = setInterval(() => {
      emblaApi.scrollPrev();
    }, AUTO_SCROLL_DELAY);

    return () => clearInterval(autoPlay);
  }, [emblaApi]);

  return (
    <section className="py-14 md:py-18" aria-label="Customer reviews">
      <div className="container mx-auto px-4 mb-10 md:mb-12">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-accent font-semibold mb-3">
            Trusted Feedback
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Customer Reviews
          </h2>
          <p className="text-base md:text-lg text-white/90 font-medium max-w-3xl mx-auto mt-4">
            Real words from teams and learners who built, tested, and shipped
            with us.
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-4 bg-white/90 border-white/70 hover:bg-white"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-4 bg-white/90 border-white/70 hover:bg-white"
              onClick={() => emblaApi?.scrollNext()}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {reviews.map((item, index) => (
              <div
                key={`${item.name}-${item.company}-${index}`}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] px-2"
              >
                <Card className="p-6 flex flex-col text-left shadow-lg h-full bg-white/95 backdrop-blur-sm border-white/70 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex gap-1 text-amber-500">
                      {Array.from({ length: item.rating }).map(
                        (_, starIndex) => (
                          <Star
                            key={starIndex}
                            className="w-4 h-4 fill-current"
                          />
                        ),
                      )}
                    </div>
                    <Quote className="w-5 h-5 text-accent/70" />
                  </div>

                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-5">
                    {item.review}
                  </p>

                  <div className="pt-4 border-t border-slate-200/80 mt-auto">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {item.role} at {item.company}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: snapCount }).map((_, index) => (
            <button
              key={`review-dot-${index}`}
              type="button"
              aria-label={`Go to review slide ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                selectedSnap === index
                  ? "bg-accent scale-110"
                  : "bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsCarousel;
