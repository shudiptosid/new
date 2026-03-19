import { useEffect, useState, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, Settings, Layers, Zap, ArrowRight, ChevronLeft, ChevronRight, Cuboid, Brain, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const AUTO_SCROLL_DELAY = 3000;

const services = [
  {
    icon: <Settings className="w-10 h-10" />,
    title: 'Consulting',
    description: 'Strategic guidance for your embedded systems and IoT architecture decisions.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: <Layers className="w-10 h-10" />,
    title: 'Prototyping',
    description: 'Rapid development of functional prototypes to validate your concepts.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: <Cpu className="w-10 h-10" />,
    title: 'Firmware Development',
    description: 'Custom firmware solutions optimized for performance and reliability.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: <Zap className="w-10 h-10" />,
    title: 'On-Demand Projects',
    description: 'Complete end-to-end development from concept to production-ready devices.',
    color: 'from-orange-500 to-amber-600',
  },
  {
    icon: <Layers className="w-10 h-10" />,
    title: 'PCB Design',
    description: 'Professional multi-layer PCB layout and hardware engineering services.',
    color: 'from-rose-500 to-red-600',
  },
  {
    icon: <Cuboid className="w-10 h-10" />,
    title: '3D Modeling and Printing',
    description: 'Professional 3D CAD modeling and prototype printing for enclosures and mechanical parts.',
    color: 'from-fuchsia-500 to-pink-600',
  },
  {
    icon: <Brain className="w-10 h-10" />,
    title: 'AI & ML',
    description: 'Applied AI and machine learning solutions for embedded intelligence and automation.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: <Globe className="w-10 h-10" />,
    title: 'Full Stack Web Development',
    description: 'End-to-end web applications with modern frontend frameworks and scalable backends.',
    color: 'from-violet-500 to-purple-600',
  },
];

const ServicesOverview = () => {
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
    dragFree: false,
    containScroll: 'trimSnaps',
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedSnap(emblaApi.selectedScrollSnap());
    const onInit = () => {
      setSnapCount(emblaApi.scrollSnapList().length);
      onSelect();
    };
    onInit();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onInit);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onInit);
    };
  }, [emblaApi]);

  // Auto-slide that pauses on hover
  useEffect(() => {
    if (!emblaApi) return;

    if (!isHovered) {
      autoSlideRef.current = setInterval(() => {
        emblaApi.scrollNext();
      }, AUTO_SCROLL_DELAY);
    }

    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [emblaApi, isHovered]);

  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="container mx-auto px-4">
        {/* Heading + Arrows */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Services That Drive Innovation
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            From initial concept to production-ready solutions, I provide comprehensive
            embedded systems development services tailored to your needs.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-4 bg-white/90 border-gray-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors"
              onClick={scrollPrev}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-4 bg-white/90 border-gray-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors"
              onClick={scrollNext}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Carousel Wrapper */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -mx-3">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex-grow-0 basis-full md:basis-1/2 lg:basis-1/4 px-3"
                >
                  <Card className="p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer border border-border/50 bg-card h-full flex flex-col relative overflow-hidden rounded-2xl">
                    {/* Top color strip */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out`} />

                    <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center text-foreground group-hover:scale-110 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-300 mb-6">
                      {service.icon}
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-emerald-600 transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed flex-grow text-sm">
                      {service.description}
                    </p>

                    <div className="mt-6 pt-6 border-t border-border/50">
                      <span className="text-sm font-semibold text-foreground group-hover:text-emerald-600 flex items-center gap-1 transition-colors">
                        Learn more
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-8 mb-12">
          {Array.from({ length: snapCount }).map((_, i) => (
            <button
              key={`service-dot-${i}`}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${selectedSnap === i
                ? 'w-6 h-2.5 bg-emerald-500'
                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-emerald-300'
                }`}
            />
          ))}
        </div>

        <div className="text-center">
          <Link to="/services">
            <Button
              variant="outline"
              size="lg"
              className="px-6 sm:px-8 py-4 text-base sm:text-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
            >
              Explore All Services
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
