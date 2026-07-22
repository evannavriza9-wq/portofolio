import React, { useState, useEffect } from 'react';
import { Download, ArrowRight, Github, Linkedin, Instagram, Figma, Sparkles, MapPin, GraduationCap } from 'lucide-react';
import { ProfileData } from '../types';

interface HeroProps {
  profile: ProfileData;
  onOpenCV: () => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, onOpenCV }) => {
  const [typedTitle, setTypedTitle] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const titles = profile.titles || ['Web Developer', 'UI/UX Designer', 'Informatics Student'];

  useEffect(() => {
    const currentTitle = titles[titleIndex % titles.length];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting && typedTitle === currentTitle) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && typedTitle === '') {
        setIsDeleting(false);
        setTitleIndex((prev) => prev + 1);
      } else {
        setTypedTitle(
          isDeleting
            ? currentTitle.substring(0, typedTitle.length - 1)
            : currentTitle.substring(0, typedTitle.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typedTitle, isDeleting, titleIndex, titles]);

  const scrollToSection = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated Glassmorphic Light Blobs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-900/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-sky-500/30 text-sky-400 text-xs font-mono shadow-inner backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span>{profile.statusText || 'Available for Freelance Projects'}</span>
            </div>

            {/* Main Greeting */}
            <div>
              <p className="text-sm font-semibold text-sky-400 uppercase tracking-widest mb-2 flex items-center justify-center lg:justify-start gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Hello World, I'm</span>
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-100 tracking-tight leading-none">
                {profile.name}
              </h1>
            </div>

            {/* Typing Animation Subtitle */}
            <div className="h-12 flex items-center justify-center lg:justify-start text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-300">
              <span className="mr-2 text-slate-400">I am a</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 font-bold border-r-2 border-sky-400 pr-1 animate-pulse">
                {typedTitle}
              </span>
            </div>

            {/* Short Bio */}
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {profile.shortBio || profile.bio}
            </p>

            {/* Quick Details Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <GraduationCap className="w-4 h-4 text-sky-400" />
                <span>{profile.university}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>{profile.location}</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenCV}
                className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4 group-hover:animate-bounce" />
                <span>Download CV</span>
              </button>

              <button
                onClick={() => scrollToSection('#projects')}
                className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700/80 transition-all duration-200"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Social Links */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
              <span className="text-xs text-slate-500 font-mono">Connect:</span>
              <div className="flex items-center gap-2">
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-sky-500/40 transition-all hover:scale-105"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-sky-500/40 transition-all hover:scale-105"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={profile.socials.figma}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-sky-500/40 transition-all hover:scale-105"
                  aria-label="Figma Profile"
                >
                  <Figma className="w-4 h-4" />
                </a>
                <a
                  href={profile.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-sky-500/40 transition-all hover:scale-105"
                  aria-label="Instagram Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm sm:max-w-md w-full">
              {/* Outer Glowing Border Ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-500 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

              {/* Glassmorphic Frame */}
              <div className="relative bg-slate-900 border border-slate-800/80 p-3 rounded-3xl shadow-2xl backdrop-blur-xl">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-slate-950">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                  {/* Floating Experience Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-md flex items-center justify-between text-xs">
                    <div>
                      <span className="block text-slate-400 text-[10px] font-mono uppercase">Full Stack Focus</span>
                      <span className="font-bold text-slate-100">React + Laravel + Tailwind</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono font-bold text-xs border border-sky-500/30">
                      100%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
