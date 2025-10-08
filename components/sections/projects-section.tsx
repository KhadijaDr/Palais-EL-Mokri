"use client"

import { useEffect, useRef, useState, useCallback, memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Home, Gamepad2, Palette, ExternalLink, X, Calendar, Users, Target } from "lucide-react"

export const ProjectsSection = memo(function ProjectsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const handleProjectClick = useCallback((project: any) => {
    setSelectedProject(project)
    setIsDialogOpen(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false)
    setSelectedProject(null)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const projects = [
    {
      icon: Home,
      title: "Dar Do",
      subtitle: "Maison d'hôtes patrimoniale",
      description:
        "Restauration et transformation d'une maison traditionnelle en maison d'hôtes de charme, alliant authenticité et confort moderne. Un modèle de valorisation du patrimoine résidentiel.",
      detailedDescription: "Le projet Dar Do représente un modèle exemplaire de restauration patrimoniale. Cette ancienne demeure traditionnelle de la médina de Fès a été soigneusement restaurée en respectant les techniques artisanales ancestrales tout en intégrant des équipements modernes pour le confort des hôtes.",
      objectives: [
        "Préserver l'architecture traditionnelle marocaine",
        "Créer un modèle économique durable",
        "Former les artisans locaux aux techniques de restauration",
        "Sensibiliser les visiteurs au patrimoine architectural"
      ],
      timeline: "2022 - 2024",
      beneficiaries: "Artisans locaux, visiteurs, communauté",
      image: "/optimized/dar do.webp",
      status: "En cours",
      progress: 75,
      link: "#",
    },
    {
      icon: Gamepad2,
      title: "Fès City Game",
      subtitle: "Découverte ludique du patrimoine",
      description:
        "Jeu de piste numérique permettant aux visiteurs de découvrir les trésors cachés de la médina de Fès de manière interactive et éducative. Une approche moderne de la médiation culturelle.",
      detailedDescription: "Fès City Game est une application mobile innovante qui transforme la visite de la médina en une aventure ludique et éducative. Les participants suivent des indices, résolvent des énigmes et découvrent l'histoire fascinante de Fès à travers un parcours interactif.",
      objectives: [
        "Moderniser la découverte du patrimoine",
        "Attirer un public jeune et familial",
        "Valoriser les sites moins connus de la médina",
        "Créer une expérience touristique unique"
      ],
      timeline: "2023 - Permanent",
      beneficiaries: "Touristes, familles, étudiants",
      image: "/optimized/fes city.webp",
      status: "Lancé",
      progress: 100,
      link: "#",
    },
    {
      icon: Palette,
      title: "Résidences d'artistes",
      subtitle: "Dialogue entre tradition et création",
      description:
        "Programme d'accueil d'artistes contemporains au Palais El Mokri pour créer un dialogue entre l'art traditionnel marocain et les expressions artistiques contemporaines.",
      detailedDescription: "Le programme de résidences d'artistes offre un espace de création unique au cœur du Palais El Mokri. Les artistes sélectionnés bénéficient d'un environnement inspirant pour développer leurs projets tout en échangeant avec les maîtres artisans locaux.",
      objectives: [
        "Favoriser les échanges culturels internationaux",
        "Préserver et transmettre les savoir-faire traditionnels",
        "Créer des œuvres hybrides tradition-modernité",
        "Développer le rayonnement artistique de Fès"
      ],
      timeline: "Programme permanent",
      beneficiaries: "Artistes internationaux, artisans locaux, public",
      image: "/optimized/residence.webp",
      status: "Permanent",
      progress: 100,
      link: "#",
    },
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-muted/30" id="projects-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2
            className={`font-display text-4xl font-bold text-foreground sm:text-5xl transition-all duration-800 ${
              isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"
            }`}
          >
            Nos projets
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"
            }`}
          >
            Découvrez les initiatives concrètes de l'Association Tourat Mdinty
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={project.title}
              className={`group overflow-hidden hover:shadow-xl transition-all duration-500 ${
                isVisible ? "animate-scale-in" : "opacity-0 scale-95"
              }`}
              style={{ animationDelay: `${400 + index * 200}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image || "/optimized/dar do.webp"}
                  alt={project.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-secondary/10 p-2">
                      <project.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === "Lancé" || project.status === "Permanent"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-muted-foreground leading-6 mb-4">{project.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium text-foreground">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full group bg-transparent"
                  onClick={() => {
                    if (project.link && project.link !== '#') {
                      window.open(project.link, '_blank')
                    } else {
                      setSelectedProject(project)
                      setIsDialogOpen(true)
                    }
                  }}
                >
                  En savoir plus
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stylish Dialog Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-secondary/20">
                    <selectedProject.icon className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      {selectedProject.title}
                    </DialogTitle>
                    <DialogDescription className="text-lg text-muted-foreground">
                      {selectedProject.subtitle}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Project Image */}
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProject.status === 'En cours' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : selectedProject.status === 'Lancé'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedProject.status}
                    </span>
                  </div>
                </div>

                {/* Detailed Description */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Description détaillée</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProject.detailedDescription}
                  </p>
                </div>

                {/* Project Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Timeline */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-secondary" />
                      <h4 className="font-semibold text-foreground">Calendrier</h4>
                    </div>
                    <p className="text-muted-foreground">{selectedProject.timeline}</p>
                  </div>

                  {/* Beneficiaries */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-secondary" />
                      <h4 className="font-semibold text-foreground">Bénéficiaires</h4>
                    </div>
                    <p className="text-muted-foreground">{selectedProject.beneficiaries}</p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-secondary" />
                      <h4 className="font-semibold text-foreground">Avancement</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium text-foreground">{selectedProject.progress}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${selectedProject.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Objectives */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Objectifs du projet</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProject.objectives.map((objective: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0"></div>
                        <p className="text-muted-foreground">{objective}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  <Button 
                    className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    onClick={() => {
                      // Redirection vers la page de don ou de contact
                      window.location.href = '/don'
                    }}
                  >
                    Soutenir ce projet
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      // Redirection vers la page de contact
                      window.location.href = '/contact'
                    }}
                  >
                    Nous contacter
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
})
