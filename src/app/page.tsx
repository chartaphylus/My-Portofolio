"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ReactNode } from "react";
import { FaCode, FaLaptopCode, FaServer, FaMobileAlt, FaGitAlt, FaPhp, FaJs, FaBootstrap } from "react-icons/fa";
import { SiLaravel, SiNextdotjs, SiBootstrap, SiTailwindcss, SiFlutter, SiAndroidstudio, SiJavascript, SiDart, SiLaragon } from "react-icons/si";
import { FaBriefcase, FaGraduationCap } from "react-icons/fa";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaDownload,
  FaEye,
  FaExternalLinkAlt,
  FaArrowUp,
  FaPlay,
  FaStar,
  FaCodeBranch
} from "react-icons/fa";

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Update active section based on scroll position
      const sections = ['about', 'skills', 'experience', 'education', 'projects', 'certificates', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  type HorizontalScrollContainerProps = {
  children: ReactNode;
  id?: string;
};


  const projects = [
    { 
      title: "Medistock App", 
      desc: "Get a Health in your Hand.", 
      img: "/project/MediStock-App.jpg",
      tech: ["Flutter", "API", "MySQL", "Dart"],
      status: "Completed",
    },
    { 
      title: "CyberFinance", 
      desc: "Monitor your Financial in Real Times.", 
      img: "/project/CyberFinance.png",
      tech: ["NextJS", "TypeScript", "Supabase", "Tailwind CSS"],
      status: "Completed",
    },
    { 
      title: "Sword Art Online", 
      desc: "sword art online virtual reality.", 
      img: "/project/SAO.png",
      tech: ["React", "Tailwind CSS", "Node.js", "Superbase"],
      status: "Completed",
    },
    { 
      title: "Wedding Invitation", 
      desc: "Start your wedding with us.", 
      img: "/project/Wedding.png",
      tech: ["HTML", "CSS", "JavaScript"],
      status: "Completed",
    },
    { 
      title: "TokoKu", 
      desc: "Trusted cashier management", 
      img: "/project/TokoKu.png",
      tech: ["Laravel", "Bootstrap", "MySQL", "PHP"],
      status: "Completed",
    },
  ];

  const certificates = [
    { img: "/sertifikat/sertifikat1.jpg", title: "Google Play Listing", issuer: "Google Play Academy", date: "2024" },
    { img: "/sertifikat/sertifikat2.png", title: "Figma AI Workflow", issuer: "Udemy", date: "2025" },
    { img: "/sertifikat/sertifikat3.png", title: "interview & CV Mastery", issuer: "Udemy", date: "2025" },
    { img: "/sertifikat/sertifikat4.png", title: "JavaScript Practicals Crash", issuer: "Udemy", date: "2025" },
    { img: "/sertifikat/sertifikat5.png", title: "Jadilah Manager kelas yang Profesional", issuer: "Robbaani Islamic School", date: "2025" },
    { img: "/sertifikat/sertifikat6.png", title: "Canva Zero To Hero", issuer: "Udemy", date: "2025" },
    { img: "/sertifikat/sertifikat7.png", title: "Microsoft Ofice Sertification", issuer: "Udemy", date: "2025" },
    { img: "/sertifikat/sertifikat8.png", title: "Media Training", issuer: "Udemy", date: "2025" },
  ];

  const skillCategories = [
    {
      title: "Programming Languages",
      icon: FaCode,
      skills: [
        { name: "PHP", icon: FaPhp, color: "text-cyan-400", level: "Advanced" },
        { name: "JavaScript", icon: FaJs, color: "text-yellow-400", level: "Advanced" },
        { name: "Dart", icon: SiDart, color: "text-blue-400", level: "Advanced" }
      ]
    },
    {
      title: "Web Development",
      icon: FaLaptopCode,
      skills: [
        { name: "Laravel", icon: SiLaravel, color: "text-red-400", level: "Advanced" },
        { name: "Next.js", icon: SiNextdotjs, color: "text-gray-300", level: "Intermediate" },
        { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-sky-400", level: "Advanced" },
        { name: "Bootstrap", icon: FaBootstrap, color: "text-purple-400", level: "Advanced" }
      ]
    },
    {
      title: "Mobile Development",
      icon: FaMobileAlt,
      skills: [
        { name: "Flutter", icon: SiFlutter, color: "text-cyan-400", level: "Intermediate" },
        { name: "Android Studio", icon: SiAndroidstudio, color: "text-green-400", level: "Intermediate" }
      ]
    },
    {
      title: "Development Tools",
      icon: FaServer,
      skills: [
        { name: "Git", icon: FaGitAlt, color: "text-orange-400", level: "Advanced" },
        { name: "Laragon", icon: SiLaragon, color: "text-green-400", level: "Advanced" }
      ]
    }
  ];

  const workExperience = [
    {
      title: "Senior Fullstack Engineer",
      company: "Indo Caris International",
      logo: "/image/indo_caris.jpg",
      type: "Full time",
      period: "July 2025 - Present",
      status: "development",
      description: "Working as a full time employee at Indo Caris International, contributing to software development and technology solutions that drive business growth and innovation.",
      statusColor: "from-green-500 to-emerald-500"
    },
    {
      title: "Education Mentor",
      company: "Rabbaanii Islamic School",
      logo: "/image/Rabbaanii.png",
      type: "Contract",
      period: "July 2025 - Present",
      status: "Education",
      description: "Mentoring and educating students in technology and software development, fostering the next generation of tech professionals through hands-on guidance and curriculum development.",
      statusColor: "from-blue-500 to-cyan-500"
    }
  ];

    const HorizontalScrollContainer = ({ children, id }: HorizontalScrollContainerProps) => {
    return (
      <div className="relative group">
        <div
          id={id}
          className="flex overflow-x-auto gap-6 pb-4 scroll-smooth scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none", 
            msOverflowStyle: "none", 
          }}
        >
          {children}
        </div>
        
        {/* Gradient overlays for visual indication */}
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 relative overflow-x-hidden">
      {/* Cyber Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)] -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)] -z-10"></div>
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 z-50 shadow-lg shadow-cyan-500/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="font-bold text-xl text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              M. Khafid Bahtiar
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {[
                { href: "#about", label: "About" },
                { href: "#skills", label: "Skills" },
                { href: "#experience", label: "Experience" },
                { href: "#projects", label: "Projects" },
                { href: "#contact", label: "Contact" }
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative overflow-hidden group ${
                    activeSection === item.href.slice(1)
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-300 hover:text-cyan-400'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {activeSection !== item.href.slice(1) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-800 border border-cyan-500/30">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl animate-ping slow"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-spin slow opacity-20"></div>
              <Image
                src="/image/profile.png"
                alt="M. Khafid Bahtiar"
                width={140}
                height={140}
                className="relative rounded-full border-2 border-cyan-400/30 shadow-2xl shadow-cyan-500/20 hover:scale-105 transition-all duration-500"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight animate-pulse">
              M. Khafid Bahtiar
            </h1>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <p className="text-xl md:text-2xl font-light text-cyan-200">
                Software Engineer
              </p>
            </div>
            
            <p className="text-lg mb-8 text-gray-300 leading-relaxed max-w-2xl px-4">
              Passionate about creating innovative solutions in web and mobile development. 
              Specializing in Laravel, Flutter, and modern JavaScript frameworks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://drive.google.com/file/d/1P5bgLUnX2Pp6bDDvwOljWbD6-RJg8n1a/view?usp=sharing"
                download
                className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-105 transition-all duration-300 group border border-cyan-400/30"
              >
                <FaDownload className="mr-2 group-hover:animate-bounce" /> 
                Download CV
              </a>
              <a
                href="#contact"
                className="inline-flex items-center bg-transparent border-2 border-cyan-400 text-cyan-400 font-semibold px-8 py-4 rounded-xl hover:bg-cyan-400/10 hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-400/10"
              >
                Let's Connect
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-20">
        
        {/* About Me */}
        <section id="about" className="scroll-mt-24">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-cyan-500/10 p-8 md:p-12 border border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
            <div className="flex items-center mb-8">
              <div className="w-2 h-16 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mr-6 shadow-lg shadow-cyan-400/50"></div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">About Me</h2>
                <p className="text-gray-400">Getting to know me better</p>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                I am <strong className="text-cyan-400">M. Khafid Bahtiar</strong>, a dedicated Software Engineer specializing in web and mobile application development. With extensive expertise in <strong className="text-purple-400">Laravel</strong>, <strong className="text-cyan-400">Flutter</strong>, and modern JavaScript frameworks, I am committed to continuous learning and delivering cutting-edge technological solutions.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                My passion lies in creating efficient, scalable, and user-friendly applications that solve real-world problems. I thrive in dynamic team environments and am always ready to take on challenging projects that push the boundaries of technology.
              </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="scroll-mt-24">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-2 h-16 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mr-6 shadow-lg shadow-cyan-400/50"></div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">Skills & Technologies</h2>
                <p className="text-gray-400">Technologies I work with to bring ideas to life</p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((category, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl shadow-cyan-500/10 p-6 border border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-cyan-500/30">
                    <category.icon className="text-cyan-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200">
                    {category.title}
                  </h3>
                </div>
                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex items-center justify-between p-3 bg-gray-900/50 backdrop-blur-xl rounded-xl hover:bg-gray-900/70 transition-colors duration-200 border border-gray-700/50">
                      <div className="flex items-center gap-3">
                        <skill.icon className={`${skill.color} text-lg`} />
                        <span className="font-medium text-gray-200 text-sm">{skill.name}</span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 rounded-lg border border-cyan-500/30">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="scroll-mt-24">
          <div className="flex items-center mb-12">
            <div className="w-2 h-16 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mr-6 shadow-lg shadow-cyan-400/50"></div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">Work Experience</h2>
              <p className="text-gray-400">My professional journey</p>
            </div>
          </div>
          
          <div className="space-y-8">
            {workExperience.map((exp, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl shadow-cyan-500/10 p-8 border border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 group">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gray-900/50 backdrop-blur-xl rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-cyan-500/30 p-2">
                      <Image
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        width={60}
                        height={60}
                        className="rounded-lg object-contain filter brightness-110"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-200 mb-1">{exp.title}</h3>
                        <p className="text-cyan-400 font-semibold mb-2">{exp.company}</p>
                        <p className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                          {exp.type} • {exp.period}
                        </p>
                      </div>
                      <span className={`mt-2 md:mt-0 px-4 py-2 bg-gradient-to-r ${exp.statusColor} text-black text-sm font-semibold rounded-full self-start shadow-lg`}>
                        {exp.status}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="scroll-mt-24">
          <div className="flex items-center mb-12">
            <div className="w-2 h-16 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mr-6 shadow-lg shadow-cyan-400/50"></div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">Education</h2>
              <p className="text-gray-400">My academic background</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl shadow-cyan-500/10 p-8 border border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 group">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-green-500/30">
                    <FaGraduationCap className="text-green-400 text-xl" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-200 mb-1">D4 | Software Engineering Technology</h3>
                    <p className="text-green-400 font-semibold mb-2">Politeknik IDN</p>
                    <p className="text-gray-400 text-sm">July 2024 • Jonggol, Bogor, Indonesia</p>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Focused on software engineering technology, software development, information systems, and application technology with hands-on practical experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl shadow-cyan-500/10 p-8 border border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 group">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-purple-500/30">
                    <FaGraduationCap className="text-purple-400 text-xl" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-200 mb-1">Junior & Senior High School</h3>
                    <p className="text-purple-400 font-semibold mb-2">Ma'had Abu Dzar Al-Ghifari</p>
                    <p className="text-gray-400 text-sm">July 2018 - June 2024 • Kediri, Lombok Barat, Indonesia</p>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Focused on Islamic studies and Quranic memorization (Tahfidz Al-Qur'an), developing deep understanding of Islamic principles while building discipline and love for religious knowledge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-24">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-2 h-16 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mr-6 shadow-lg shadow-cyan-400/50"></div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">Featured Projects</h2>
                <p className="text-gray-400">Some of the projects I've worked on recently</p>
              </div>
            </div>
          </div>
          
          <HorizontalScrollContainer id="projects-scroll">
            {projects.map((project, index) => (
              <div
                key={index}
                className="min-w-[360px] sm:min-w-[400px] bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-cyan-500/10 overflow-hidden border border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 group hover:-translate-y-2 flex-shrink-0 snap-start"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={project.img}
                    alt={project.title}
                    width={400}
                    height={250}
                    className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border ${
                      project.status === 'Completed' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    } shadow-lg`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Cyber Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(6,182,212,0.1)_25%,rgba(6,182,212,0.1)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.1)_75%,rgba(6,182,212,0.1)_76%,transparent_77%),linear-gradient(-45deg,transparent_24%,rgba(147,51,234,0.1)_25%,rgba(147,51,234,0.1)_26%,transparent_27%,transparent_74%,rgba(147,51,234,0.1)_75%,rgba(147,51,234,0.1)_76%,transparent_77%)] bg-[length:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-4">
                      <button className="p-3 bg-cyan-500/20 backdrop-blur-sm text-cyan-400 rounded-full hover:bg-cyan-500/30 transition-colors border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                        <FaPlay className="text-lg" />
                      </button>
                      <button className="p-3 bg-purple-500/20 backdrop-blur-sm text-purple-400 rounded-full hover:bg-purple-500/30 transition-colors border border-purple-500/30 shadow-lg shadow-purple-500/20">
                        <FaCodeBranch className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">

                  <h3 className="text-xl font-bold text-gray-200 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 leading-relaxed line-clamp-3 text-sm">
                    {project.desc}
                  </p>
                  
                </div>
              </div>
            ))}
          </HorizontalScrollContainer>
        </section>

        {/* Certificates Section */}
        <section id="certificates" className="scroll-mt-24">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-2 h-16 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mr-6 shadow-lg shadow-cyan-400/50"></div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">Certifications</h2>
                <p className="text-gray-400">Professional certifications and achievements</p>
              </div>
            </div>
          </div>
          
          <HorizontalScrollContainer id="certificates-scroll">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="min-w-[280px] sm:min-w-[320px] bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-cyan-500/10 overflow-hidden border border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 group hover:-translate-y-2 flex-shrink-0 snap-start"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={cert.img}
                    alt={cert.title}
                    width={320}
                    height={200}
                    className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-cyan-400 text-xs font-semibold rounded-lg border border-cyan-500/30">
                      {cert.date}
                    </span>
                  </div>
                  
                  {/* Cyber Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(6,182,212,0.1)_25%,rgba(6,182,212,0.1)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.1)_75%,rgba(6,182,212,0.1)_76%,transparent_77%)] bg-[length:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-3">
                      <button className="p-3 bg-cyan-500/20 backdrop-blur-sm text-cyan-400 rounded-full hover:bg-cyan-500/30 transition-colors border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                        <FaEye className="text-lg" />
                      </button>
                      <button className="p-3 bg-purple-500/20 backdrop-blur-sm text-purple-400 rounded-full hover:bg-purple-500/30 transition-colors border border-purple-500/30 shadow-lg shadow-purple-500/20">
                        <FaExternalLinkAlt className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-gray-200 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300 leading-snug line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-cyan-400 font-medium mb-1">{cert.issuer}</p>
                  <p className="text-xs text-gray-500">Issued {cert.date}</p>
                </div>
              </div>
            ))}
          </HorizontalScrollContainer>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-24">
          <div className="bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-500/20 p-8 md:p-12 text-gray-100 relative overflow-hidden border border-cyan-500/20">
            {/* Cyber Background Effects */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(6,182,212,0.05)_25%,rgba(6,182,212,0.05)_26%,transparent_27%,transparent_74%,rgba(6,182,212,0.05)_75%,rgba(6,182,212,0.05)_76%,transparent_77%)] bg-[length:30px_30px]"></div>
            
            <div className="relative">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-4">Let's Work Together</h2>
                <p className="text-cyan-200 text-lg">
                  Ready to bring your ideas to life? Get in touch and let's discuss your next project.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-200">
                    <FaEnvelope className="text-cyan-400" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-cyan-500/20 hover:bg-gray-800/50 transition-all duration-300 group">
                      <FaMapMarkerAlt className="text-cyan-400 text-xl flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="font-medium text-gray-200 mb-1">Location</p>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          Jl. Diponegoro, Melayu, kec. Asakota<br />
                          Kota Bima, NTB, 84119
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-cyan-500/20 hover:bg-gray-800/50 transition-all duration-300 group">
                      <FaPhoneAlt className="text-cyan-400 text-xl flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="font-medium text-gray-200 mb-1">Phone</p>
                        <a href="tel:+62895341675030" className="text-gray-300 hover:text-cyan-400 transition-colors">
                          (+62) 895-3416-75030
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-cyan-500/20 hover:bg-gray-800/50 transition-all duration-300 group">
                      <FaEnvelope className="text-cyan-400 text-xl flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="font-medium text-gray-200 mb-1">Email</p>
                        <a href="mailto:mkhafid.work@gmail.com" className="text-gray-300 hover:text-cyan-400 transition-colors">
                          mkhafid.work@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-200">
                    <FaGithub className="text-cyan-400" />
                    Follow Me
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="https://www.instagram.com/rain.kyalka_33"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-3 p-6 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-cyan-500/20 hover:bg-gray-800/50 hover:scale-105 transition-all duration-300 group text-center"
                    >
                      <FaInstagram className="text-pink-400 text-3xl group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-gray-200 font-medium block">Instagram</span>
                        <span className="text-gray-400 text-sm">@rain.kyalka_33</span>
                      </div>
                    </a>
                    
                    <a
                      href="https://www.facebook.com/profile.php?id=61576972962347&mibextid=ZbWKwL"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-3 p-6 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-cyan-500/20 hover:bg-gray-800/50 hover:scale-105 transition-all duration-300 group text-center"
                    >
                      <FaFacebook className="text-blue-400 text-3xl group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-gray-200 font-medium block">Facebook</span>
                        <span className="text-gray-400 text-sm">M. Khafid</span>
                      </div>
                    </a>
                    
                    <a
                      href="https://www.linkedin.com/in/khafid-bahtiar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-3 p-6 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-cyan-500/20 hover:bg-gray-800/50 hover:scale-105 transition-all duration-300 group text-center"
                    >
                      <FaLinkedin className="text-blue-400 text-3xl group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-gray-200 font-medium block">LinkedIn</span>
                        <span className="text-gray-400 text-sm">khafid-bahtiar</span>
                      </div>
                    </a>
                    
                    <a
                      href="https://github.com/chartaphylus"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-3 p-6 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-cyan-500/20 hover:bg-gray-800/50 hover:scale-105 transition-all duration-300 group text-center"
                    >
                      <FaGithub className="text-gray-300 text-3xl group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-gray-200 font-medium block">GitHub</span>
                        <span className="text-gray-400 text-sm">chartaphylus</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="text-center mt-12">
                <div className="inline-flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:mkhafid.work@gmail.com"
                    className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-105 transition-all duration-300 group border border-cyan-400/30"
                  >
                    <FaEnvelope className="mr-3 group-hover:animate-pulse" /> 
                    Send Message
                  </a>
                  <a
                    href="https://drive.google.com/file/d/1P5bgLUnX2Pp6bDDvwOljWbD6-RJg8n1a/view?usp=sharing"
                    download
                    className="inline-flex items-center bg-transparent border-2 border-cyan-400 text-cyan-400 font-semibold px-8 py-4 rounded-2xl hover:bg-cyan-400/10 hover:scale-105 transition-all duration-300 group shadow-lg shadow-cyan-400/10"
                  >
                    <FaDownload className="mr-3 group-hover:animate-bounce" /> 
                    Download CV
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-xl text-gray-300 py-16 mt-20 border-t border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-bold text-2xl mb-4">M. Khafid Bahtiar</h3>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Software Engineer passionate about creating innovative solutions 
                in web and mobile development. Let's build something amazing together.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/rain.kyalka_33"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800/50 backdrop-blur-xl border border-cyan-500/30 rounded-xl flex items-center justify-center hover:bg-pink-500/20 hover:border-pink-500/50 hover:scale-110 transition-all duration-300"
                >
                  <FaInstagram className="text-lg text-pink-400" />
                </a>
                <a
                  href="https://www.linkedin.com/in/khafid-bahtiar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800/50 backdrop-blur-xl border border-cyan-500/30 rounded-xl flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-500/50 hover:scale-110 transition-all duration-300"
                >
                  <FaLinkedin className="text-lg text-blue-400" />
                </a>
                <a
                  href="https://github.com/chartaphylus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800/50 backdrop-blur-xl border border-cyan-500/30 rounded-xl flex items-center justify-center hover:bg-gray-500/20 hover:border-gray-500/50 hover:scale-110 transition-all duration-300"
                >
                  <FaGithub className="text-lg text-gray-300" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-cyan-400 font-semibold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { href: "#about", label: "About" },
                  { href: "#skills", label: "Skills" },
                  { href: "#experience", label: "Experience" },
                  { href: "#projects", label: "Projects" }
                ].map((link) => (
                  <li key={link.href}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-cyan-400 font-semibold mb-6 text-lg">Services</h4>
              <ul className="space-y-3 text-gray-400">
                <li>Web Development</li>
                <li>Mobile App Development</li>
                <li>API Development</li>
                <li>Database Management</li>
                <li>UI/UX Design</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-center md:text-left">
                © {new Date().getFullYear()} M. Khafid Bahtiar. All rights reserved.
              </p>
              <p className="text-cyan-400 text-sm font-medium">
                Built with Next.js & Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl text-cyan-400 rounded-2xl shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-110 transition-all duration-300 flex items-center justify-center group z-50 border border-cyan-500/30"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-lg group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}

      {/* Custom CSS for hiding scrollbars and cyber effects */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Smooth scrolling for horizontal containers */
        .overflow-x-auto {
          scroll-behavior: smooth;
        }
        
        /* Custom focus styles */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid #06b6d4;
          outline-offset: 2px;
        }

        /* Cyber animations */
        .slow {
          animation-duration: 3s;
        }

        @keyframes cyber-glow {
          0%, 100% {
            text-shadow: 0 0 5px #06b6d4, 0 0 10px #06b6d4, 0 0 15px #06b6d4;
          }
          50% {
            text-shadow: 0 0 10px #9333ea, 0 0 20px #9333ea, 0 0 30px #9333ea;
          }
        }

        .cyber-glow {
          animation: cyber-glow 2s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}