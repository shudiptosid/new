import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, Quote, ChevronLeft, ChevronRight } from "lucide-react";

type Review = {
  name: string;
  role: string;
  company: string;
  rating: number;
  review: string;
};

const reviews: Review[] = [
  {
    name: "Inkyin",
    role: "Founder",
    company: "Nexa AgroTech",
    rating: 4.6,
    review:
      "Circuit Crafters delivered our remote sensor prototype ahead of schedule and handled every integration challenge with confidence. The firmware was stable, the hardware quality was excellent, and the documentation made handover easy for our internal team.",
  },
  {
    name: "Vinakyak Thakur",
    role: "Product Manager",
    company: "UrbanGrid Labs",
    rating: 4.7,
    review:
      "Their team simplified a complex IoT pipeline that had been blocking our release timeline for months. In a few weeks, we moved from unstable lab tests to a production-ready build with better reliability, cleaner architecture, and clearer milestones.",
  },
  {
    name: "Mohit Deoli",
    role: "Operations Lead",
    company: "BluePulse Manufacturing",
    rating: 4.5,
    review:
      "Fast communication, practical engineering decisions, and a strong reliability-first mindset. They understood industrial deployment constraints and designed around them from day one, which reduced rework and helped us launch with confidence.",
  },
  {
    name: "Deepu Yadav",
    role: "STEM Instructor",
    company: "FutureMinds Academy",
    rating: 4.3,
    review:
      "Our students loved the learning kits and actually completed projects faster because the instructions were so clear. The tutorials are practical, beginner-friendly, and support from the team has been responsive and genuinely helpful throughout.",
  },
  {
    name: "Ashis Dhakad",
    role: "CTO",
    company: "AeroDock Systems",
    rating: 4.8,
    review:
      "From firmware optimization to board-level design decisions, their input improved performance across the stack. We reduced iteration cycles, fixed long-standing edge-case bugs, and achieved a far more robust prototype than our previous versions.",
  },
  {
    name: "Rohan Kumar",
    role: "Research Assistant",
    company: "Smart City Lab",
    rating: 4.4,
    review:
      "The team helped us build an end-to-end monitoring stack with stable telemetry, clean dashboards, and structured deployment steps. Their process was transparent and technical communication was excellent from planning to final delivery.",
  },
  {
    name: "Harshit Sharma",
    role: "Project Coordinator",
    company: "GreenGrid Energy",
    rating: 4.6,
    review:
      "Professional workflow, transparent updates, and robust prototypes at every stage. They kept timelines realistic, gave clear progress reports, and delivered an architecture we now use as our baseline standard for future projects.",
  },
  {
    name: "Shibbir Ahmed Shiblee",
    role: "Systems Integrator",
    company: "Delta Embedded Works",
    rating: 4.5,
    review:
      "What stood out most was their ability to translate requirements into a practical implementation plan. They balanced speed and quality well, and the final system was cleaner, more maintainable, and easier for our team to extend.",
  },
  {
    name: "Sukhman Kaur",
    role: "Program Manager",
    company: "Northbeam Automation",
    rating: 4.7,
    review:
      "Circuit Crafters handled our multi-module delivery with discipline and technical depth. Their team proactively identified risks, proposed smarter alternatives, and delivered outputs that were reliable enough for direct field validation.",
  },
  {
    name: "Manwinder Shing",
    role: "Embedded Developer",
    company: "Vertex Control Labs",
    rating: 4.3,
    review:
      "The code quality and hardware-level debugging support were excellent. They helped us eliminate intermittent failures and optimize runtime behavior, which significantly improved our confidence in long-duration test deployments.",
  },
  {
    name: "Amit Goyal",
    role: "Engineering Lead",
    company: "Kinetic IoT Systems",
    rating: 4.6,
    review:
      "Their technical recommendations were practical and cost-aware. We received a solution that was not just functional, but scalable and production-oriented, with clear documentation that reduced onboarding time for new team members.",
  },
  {
    name: "Naina Sharma",
    role: "Product Strategist",
    company: "SignalArc Technologies",
    rating: 4.8,
    review:
      "Great collaboration from kickoff to delivery. They aligned engineering choices with product goals, improved user-facing reliability, and gave us a strong technical foundation that directly supported our roadmap decisions.",
  },
  {
    name: "Amandeep Kaur",
    role: "Research Engineer",
    company: "Orion Mechatronics",
    rating: 4.4,
    review:
      "Their team was responsive, detail-oriented, and strong in both firmware and integration. We appreciated their structured approach, quick iteration cycles, and consistent focus on delivering a stable and testable system.",
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
    containScroll: "trimSnaps",
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

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    return Array.from({ length: 5 }).map((_, index) => {
      if (index < fullStars) {
        return <Star key={index} className="w-4 h-4 fill-current" />;
      }

      if (index === fullStars && hasHalfStar) {
        return <StarHalf key={index} className="w-4 h-4 fill-current" />;
      }

      return <Star key={index} className="w-4 h-4 text-amber-200" />;
    });
  };

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
          <div className="flex -mx-2">
            {reviews.map((item, index) => (
              <div
                key={`${item.name}-${item.company}-${index}`}
                className="shrink-0 grow-0 basis-full md:basis-1/3 min-w-0 px-2"
              >
                <Card className="p-6 flex flex-col text-left shadow-lg h-full bg-white/95 backdrop-blur-sm border-white/70 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex gap-1 text-amber-500">
                      {renderRatingStars(item.rating)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-amber-600">
                        {item.rating.toFixed(1)}/5
                      </span>
                      <Quote className="w-5 h-5 text-accent/70" />
                    </div>
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
