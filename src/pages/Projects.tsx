import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import iotSensorImage from '@/assets/project-iot-sensor.jpg';
import smartHomeImage from '@/assets/project-smart-home.jpg';
import industrialImage from '@/assets/project-industrial.jpg';

const Projects = () => {
  const projects = [
    {
      title: 'IoT Sensor Network',
      description: 'Wireless sensor nodes with long-range communication and ultra-low power consumption for environmental monitoring applications.',
      image: iotSensorImage,
      tech: ['STM32L4', 'LoRaWAN', 'Ultra Low Power', 'Environmental Sensors'],
      year: '2023',
      category: 'IoT Solutions',
    },
    {
      title: 'Smart Home Controller',
      description: 'Intelligent home automation hub with touchscreen interface and seamless integration with various smart devices.',
      image: smartHomeImage,
      tech: ['Raspberry Pi 4', 'Qt/QML', 'Zigbee 3.0', 'Matter Protocol'],
      year: '2023',
      category: 'Home Automation',
    },
    {
      title: 'Industrial IoT Gateway',
      description: 'Ruggedized industrial gateway for connecting legacy equipment to modern IoT platforms with edge computing capabilities.',
      image: industrialImage,
      tech: ['ARM Cortex-A72', 'Modbus RTU/TCP', 'MQTT', 'Edge Computing'],
      year: '2023',
      category: 'Industrial IoT',
    },
    {
      title: 'Wearable Health Monitor',
      description: 'Compact wearable device for continuous health monitoring with advanced signal processing and wireless connectivity.',
      image: iotSensorImage,
      tech: ['nRF52840', 'Bluetooth 5.0', 'PPG Sensor', 'Machine Learning'],
      year: '2022',
      category: 'Healthcare',
    },
    {
      title: 'Agricultural Drone Controller',
      description: 'Flight controller system for agricultural drones with precision navigation and autonomous spraying capabilities.',
      image: industrialImage,
      tech: ['STM32H7', 'Real-time Control', 'GPS/RTK', 'CAN Bus'],
      year: '2022',
      category: 'Agriculture',
    },
    {
      title: 'Energy Management System',
      description: 'Smart energy monitoring and management system for commercial buildings with predictive analytics.',
      image: smartHomeImage,
      tech: ['ESP32-S3', 'WiFi 6', 'Power Metering', 'Cloud Integration'],
      year: '2022',
      category: 'Energy',
    },
  ];

  const categories = ['All', 'IoT Solutions', 'Home Automation', 'Industrial IoT', 'Healthcare', 'Agriculture', 'Energy'];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-surface-elevated mb-6">
              Project
              <span className="text-accent"> Portfolio</span>
            </h1>
            <p className="text-xl text-surface-elevated/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Explore a collection of innovative embedded systems and IoT solutions 
              I've developed across various industries and applications.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                className={category === 'All' ? 'bg-accent hover:bg-accent/90' : 'hover:bg-accent hover:text-accent-foreground'}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-strong transition-all duration-300 group cursor-pointer">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-surface-elevated" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{project.year}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.slice(0, 3).map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-accent hover:text-accent/80"
                  >
                    View Case Study
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Have a Project in Mind?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss how I can help bring your embedded system ideas to life.
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 px-8 py-4 text-lg">
            Start Your Project
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Projects;