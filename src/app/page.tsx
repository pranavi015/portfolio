"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Mail, Sparkles, Terminal, Database, Code2, BrainCircuit, Cloud } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState, useRef, ReactNode } from "react";

// --- MICRO-INTERACTION COMPONENTS ---

function Magnetic({ children, className = "" }: { children: ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealText({ text, className = "" }: { text: string, className?: string }) {
  const words = text.split(" ");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
        hidden: {}
      }}
      className={`inline-block ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            variants={{
              hidden: { y: "120%", opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}

// --- CONSTANTS ---

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1, ease: "easeOut" as const },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
  viewport: { once: true, margin: "-50px" },
};

export default function Home() {
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax for background
  const bgY1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  
  // Progress line
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-spaceCadet text-slate-50 overflow-x-hidden selection:bg-pinkLavender/30 selection:text-white font-sans relative">
      
      {/* Layered Subtle Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-spaceCadet">
        {/* Layer 2: Top-right purple haze (Pink Lavender) */}
        <motion.div style={{ y: bgY1 }} className="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] bg-[#CEB5D4] rounded-full blur-[200px] md:blur-[300px] opacity-[0.06]" />
        
        {/* Layer 3: Soft blue ambient spread (Cyan Azure) */}
        <motion.div style={{ y: bgY2 }} className="absolute -bottom-[20%] -left-[10%] w-[90vw] h-[90vw] max-w-[1400px] max-h-[1400px] bg-[#4E7AB1] rounded-full blur-[250px] md:blur-[350px] opacity-[0.08]" />

        {/* Layer 5: Vignette for darker edges */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0a1930_150%)]" />
      </div>

      {/* Layer 4: Ultra subtle grain/noise texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Connecting Thread */}
      <div className="fixed left-4 md:left-12 top-0 bottom-0 w-[1px] bg-white/5 z-40 hidden md:block">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-pinkLavender to-cyanAzure origin-top shadow-[0_0_15px_rgba(206,181,212,0.5)]"
          style={{ scaleY, height: "100%" }}
        />
      </div>

      {/* Minimal Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-spaceCadet/40 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-[1200px] mx-auto px-6 md:pl-32 h-20 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tighter text-white">
            P<span className="text-pinkLavender">.</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-airSuperiority">
            <Link href="#about" className="hover:text-pinkLavender transition-colors">About</Link>
            <Link href="#skills" className="hover:text-pinkLavender transition-colors">Skills</Link>
            <Link href="#projects" className="hover:text-pinkLavender transition-colors">Projects</Link>
            <Link href="#stack" className="hover:text-pinkLavender transition-colors">Stack</Link>
            <Link href="#contact" className="hover:text-pinkLavender transition-colors">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 md:pl-20">
        
        {/* HERO SECTION (Intrigue) */}
        <section className="min-h-screen flex items-center justify-center pt-20 px-6 relative">
          <div className="max-w-[1200px] w-full mx-auto relative z-10">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex items-center gap-2 text-pinkLavender font-medium mb-6 tracking-wide text-sm uppercase"
              >
                <Sparkles className="w-4 h-4" />
                <span>Full Stack Developer</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white max-w-4xl">
                <RevealText text="Engineering impact" />{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pinkLavender to-cyanAzure opacity-90">
                  <RevealText text="through code." />
                </span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.8 }}
                className="text-lg md:text-xl text-airSuperiority max-w-2xl mb-12 leading-relaxed font-light"
              >
                I build intelligent, scalable, and beautifully designed digital experiences. 
                Welcome to my journey at the intersection of design and logic.
              </motion.p>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }} className="flex items-center gap-4 mt-4">
                <Link href="#about">
                  <Magnetic>
                    <div className="relative group cursor-pointer">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-pinkLavender to-cyanAzure rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                      <button className="relative px-8 py-4 bg-spaceCadet border border-white/10 text-white rounded-full font-medium flex items-center gap-2 transition-all backdrop-blur-md overflow-hidden">
                        <span className="relative z-10">Enter the Journey</span>
                        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform text-pinkLavender" />
                      </button>
                    </div>
                  </Magnetic>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION (Personality) */}
        <section id="about" className="py-20 px-6">
          <div className="max-w-[1200px] mx-auto pt-10">
            <div className="grid md:grid-cols-12 gap-12 items-start">
              <motion.div {...fadeUp} className="md:col-span-5 sticky top-32 pr-4">
                <h2 className="text-sm uppercase tracking-widest text-pinkLavender mb-4 font-semibold flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-gradient-to-r from-pinkLavender to-cyanAzure hidden md:block"></span> About Me
                </h2>
                <h3 className="text-3xl md:text-4xl font-semibold mb-6 leading-[1.3] text-white/95">
                  Building scalable intelligent systems with a focus on clarity, performance, and seamless experiences.
                </h3>
              </motion.div>
              <div className="md:col-span-7 space-y-12">
                <motion.div {...fadeUp} className="space-y-6 text-lg text-airSuperiority leading-relaxed font-light">
                  <p>
                    Technology isn&apos;t just about syntax; it&apos;s about solving real problems. 
                    My approach is deeply rooted in understanding the &apos;why&apos; before the &apos;how&apos;. 
                    Whether I&apos;m architecting a robust backend or polishing a delicate UI interaction, 
                    the end-user is always my compass.
                  </p>
                  <p>
                    I thrive in the ambiguous spaces between disciplines. I don&apos;t just write code; 
                    I collaborate, I iterate, and I obsess over the details that turn a good product 
                    into a great one.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="pl-8 border-l-2 border-pinkLavender/30 italic text-xl text-white/90 font-light"
                >
                  &quot;Simplicity is the ultimate sophistication. I strive to build complex systems that feel effortless.&quot;
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION (Capability) */}
        <section id="skills" className="py-20 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
          <div className="max-w-[1200px] mx-auto relative z-10">
            <motion.div {...fadeUp} className="mb-12">
              <h2 className="text-sm uppercase tracking-widest text-cyanAzure mb-4 font-semibold flex items-center gap-4">
                <span className="w-8 h-[1px] bg-cyanAzure/50 hidden md:block"></span> Expertise
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold">What I bring to the table.</h3>
            </motion.div>
            
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { title: "Frontend Development", icon: Terminal, color: "text-pinkLavender", border: "hover:border-pinkLavender/40", desc: "Building responsive, accessible, and performant user interfaces.", tags: ["React", "Next.js", "TailwindCSS", "TypeScript"] },
                { title: "Backend & APIs", icon: Database, color: "text-cyanAzure", border: "hover:border-cyanAzure/40", desc: "Architecting secure, scalable server-side logic and database schemas.", tags: ["Node.js", "Express", "PostgreSQL", "Prisma"] },
                { title: "Currently Learning", icon: Cloud, color: "text-uclaBlue", border: "hover:border-uclaBlue/60", desc: "Expanding my horizons to build more resilient infrastructure and intelligent systems.", tags: ["Docker", "AWS", "CI/CD", "Machine Learning"] }
              ].map((skill, idx) => (
                <motion.div key={idx} variants={fadeUp} className={`bg-spaceCadet/40 border border-white/5 p-8 rounded-3xl backdrop-blur-md group ${skill.border} transition-colors duration-500`}>
                  <skill.icon className={`w-8 h-8 ${skill.color} mb-6 transform group-hover:scale-110 transition-transform duration-500`} />
                  <h4 className="text-xl font-bold mb-4">{skill.title}</h4>
                  <p className="text-airSuperiority mb-6 text-sm font-light leading-relaxed">{skill.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {skill.tags.map((t) => (
                      <span key={t} className="text-xs px-3 py-1 bg-white/5 rounded-full text-slate-300 border border-white/5">{t}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* PROJECTS SECTION (Proof) */}
        <section id="projects" className="py-20 px-6">
          <div className="max-w-[1200px] mx-auto pt-10">
            <motion.div {...fadeUp} className="mb-16">
              <h2 className="text-sm uppercase tracking-widest text-pinkLavender mb-4 font-semibold flex items-center gap-4">
                <span className="w-8 h-[1px] bg-pinkLavender/50 hidden md:block"></span> Projects
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold">Selected Works.</h3>
            </motion.div>

            <div className="space-y-24">
              {[
                { 
                  title: "Daywise", 
                  github: "https://github.com/pranavi015/day_wise", 
                  desc: "A comprehensive day planning and productivity application designed to help users organize tasks, track habits, and manage their daily workflows with an intuitive interface.", 
                  tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "postgresql"]
                },
                { 
                  title: "MoodMeal", 
                  github: "https://github.com/pranavi015/MoodMeal", 
                  desc: "An intelligent platform that suggests personalized meals and recipes based on the user's current mood, leveraging smart recommendation algorithms and a clean user experience.", 
                  tags: ["React", "Node.js", "Express", "mongodb", "prisma"]
                }
              ].map((project, idx) => (
                <div
                  key={project.title}
                  className={`grid md:grid-cols-12 gap-16 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                >
                  <motion.div 
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: "easeOut" as const }}
                    className={`md:col-span-7 ${idx % 2 === 1 ? 'md:order-2' : ''}`}
                  >
                    <div className="group relative aspect-[16/10] rounded-3xl overflow-hidden bg-spaceCadet/50 border border-white/10 transform perspective-1000">
                      <div className="absolute inset-0 bg-gradient-to-br from-uclaBlue/20 to-transparent z-10 opacity-50 group-hover:opacity-20 transition-opacity duration-700" />
                      
                      {/* Placeholder for project image with subtle parallax/scale on hover */}
                      <div className="absolute inset-0 bg-spaceCadet group-hover:scale-105 transition-transform duration-1000 ease-out flex items-center justify-center">
                        <span className="text-white/10 font-bold text-4xl">{project.title}</span>
                      </div>

                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-center justify-center">
                        <Magnetic>
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white/10 border border-white/20 rounded-full text-sm backdrop-blur-md text-white font-medium hover:bg-white/20 transition-colors inline-block">
                            View on GitHub
                          </a>
                        </Magnetic>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" as const }}
                    className={`md:col-span-5 ${idx % 2 === 1 ? 'md:order-1' : ''}`}
                  >
                    <h4 className="text-3xl font-bold mb-6">{project.title}</h4>
                    <p className="text-airSuperiority leading-relaxed mb-8 font-light text-lg">
                      {project.desc}
                    </p>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium px-3 py-1 bg-white/5 border border-white/10 text-slate-300 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STACK SECTION (The Tech Setup) */}
        <section id="stack" className="py-20 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
          <div className="max-w-[1200px] mx-auto relative z-10 pt-10">
            <motion.div {...fadeUp} className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-widest text-cyanAzure mb-4 font-semibold">Technical Foundation</h2>
              <h3 className="text-3xl md:text-5xl font-bold">Tools of the trade.</h3>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: "Full Stack Core", icon: Code2, color: "text-pinkLavender", border: "border-pinkLavender/50", items: ["JavaScript (ES6+)", "TypeScript", "React & Next.js", "Node.js & Express", "SQL & NoSQL Databases"] },
                { title: "AI / ML", icon: BrainCircuit, color: "text-cyanAzure", border: "border-cyanAzure/50", items: ["Python", "Pandas & NumPy", "Scikit-learn", "LLM Integration"] },
                { title: "DevOps (Learning)", icon: Cloud, color: "text-uclaBlue", border: "border-uclaBlue/50", items: ["Docker Containerization", "AWS Fundamentals", "CI/CD Pipelines", "Git Advanced Workflows"] }
              ].map((category, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                  className={`p-8 border-l-[3px] ${category.border} bg-gradient-to-r from-white/[0.02] to-transparent relative group`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-[1px] bg-${category.border.split('-')[1]} shadow-[0_0_10px_rgba(255,255,255,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <category.icon className={`w-6 h-6 ${category.color} mb-6`} />
                  <h4 className="text-xl font-bold mb-8 text-white">{category.title}</h4>
                  <ul className="space-y-4 text-airSuperiority font-light">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-4 group/item">
                        <div className={`w-1.5 h-1.5 rounded-full bg-white/20 group-hover/item:bg-white transition-colors duration-300`}></div> 
                        <span className="group-hover/item:text-white transition-colors duration-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION (Connection) */}
        <section id="contact" className="py-24 px-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-[800px] mx-auto text-center pt-10">
            <motion.div {...fadeUp}>
              <h2 className="text-sm uppercase tracking-widest text-pinkLavender mb-4 font-semibold">Let&apos;s Connect</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6">Ready to start?</h3>
              <p className="text-lg md:text-xl text-airSuperiority mb-12 font-light max-w-lg mx-auto">
                Whether it&apos;s a project, an opportunity, or just to say hi. My inbox is open.
              </p>
              
              <form onSubmit={handleSubmit} className="text-left space-y-5 max-w-md mx-auto mb-16 relative group">
                <div className="absolute -inset-10 bg-gradient-to-r from-pinkLavender/5 to-cyanAzure/5 rounded-[3rem] blur-3xl -z-10 opacity-50 group-focus-within:opacity-100 transition-opacity duration-700" />
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-3 pl-4 text-slate-300">Name</label>
                  <input required type="text" id="name" name="name" className="w-full px-6 py-4 rounded-2xl bg-spaceCadet/50 border border-white/5 backdrop-blur-xl focus:outline-none focus:border-pinkLavender/30 focus:ring-1 focus:ring-pinkLavender/30 transition-all text-white placeholder-white/20 font-light" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-3 pl-4 text-slate-300">Email</label>
                  <input required type="email" id="email" name="email" className="w-full px-6 py-4 rounded-2xl bg-spaceCadet/50 border border-white/5 backdrop-blur-xl focus:outline-none focus:border-pinkLavender/30 focus:ring-1 focus:ring-pinkLavender/30 transition-all text-white placeholder-white/20 font-light" placeholder="john@example.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-3 pl-4 text-slate-300">Message</label>
                  <textarea required id="message" name="message" rows={4} className="w-full px-6 py-4 rounded-2xl bg-spaceCadet/50 border border-white/5 backdrop-blur-xl focus:outline-none focus:border-pinkLavender/30 focus:ring-1 focus:ring-pinkLavender/30 transition-all resize-none text-white placeholder-white/20 font-light" placeholder="How can I help you?"></textarea>
                </div>
                <Magnetic>
                  <button
                    disabled={formStatus === "loading" || formStatus === "success"}
                    className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-medium hover:bg-white/10 transition-all disabled:opacity-70 backdrop-blur-md relative overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pinkLavender/20 to-cyanAzure/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10">{formStatus === "loading" ? "Sending..." : formStatus === "success" ? "Message Sent!" : "Send Message"}</span>
                  </button>
                </Magnetic>
              </form>

              <div className="flex items-center justify-center gap-8">
                <Magnetic>
                  <a href="https://github.com/pranavi015" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 hover:border-white/20 transition-all group relative block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-airSuperiority group-hover:text-white transition-colors relative z-10"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="https://www.linkedin.com/in/pranavi-mathur-a08974240/" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 hover:border-white/20 transition-all group relative block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-airSuperiority group-hover:text-white transition-colors relative z-10"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="mailto:mathurpranavi15@gmail.com" className="p-4 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 hover:border-white/20 transition-all group relative block">
                    <Mail className="w-5 h-5 text-airSuperiority group-hover:text-white transition-colors relative z-10" />
                  </a>
                </Magnetic>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-airSuperiority text-sm border-t border-white/5">
        <p>© {new Date().getFullYear()} Portfolio. Built with precision.</p>
      </footer>
    </div>
  );
}
