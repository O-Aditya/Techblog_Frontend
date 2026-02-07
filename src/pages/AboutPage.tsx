import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Github, Linkedin, Mail, Terminal, Cpu, Globe, Database } from 'lucide-react';

const AboutPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">

            {/* Hero Section with Terminal Effect */}
            <section className="space-y-6 text-center md:text-left flex flex-col md:flex-row gap-8 items-start">
                {/* Text Content */}
                <div className="flex-1 space-y-6 pt-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-mono border border-accent/20 mx-auto md:mx-0">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                        </span>
                        System Online
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Hello, I'm <br />
                        <span className="text-accent">Aditya Maurya</span>
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Full Stack Developer & Tech Enthusiast building scalable systems and crafting digital experiences.
                        <br /><br />
                        I specialize in building high-performance applications using modern technologies.
                        Always learning, always shipping.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                        <Button
                            as="a"
                            href="mailto:contact@aditya.sh"
                            variant="flat"
                            className="font-mono bg-foreground text-background font-semibold"
                            startContent={<Mail size={18} />}
                        >
                            Contact Me
                        </Button>
                        <Button
                            as="a"
                            href="https://github.com/O-Aditya/"
                            target="_blank"
                            variant="bordered"
                            className="font-mono border-border hover:border-accent hover:text-accent"
                            startContent={<Github size={18} />}
                        >
                            GitHub
                        </Button>
                        <Button
                            as="a"
                            href="https://linkedin.com"
                            target="_blank"
                            variant="bordered"
                            className="font-mono border-border hover:border-blue-500 hover:text-blue-500"
                            startContent={<Linkedin size={18} />}
                        >
                            LinkedIn
                        </Button>
                    </div>
                </div>

                {/* Profile Photo - Moved to Right */}
                <div className="w-full md:w-1/3 flex flex-col items-center justify-center animate-in slide-in-from-right duration-700">
                    <div className="relative group">
                        <img
                            src="/profile.png"
                            alt="Aditya Maurya"
                            className="relative rounded-full w-64 h-64 object-cover border-4 border-background shadow-2xl transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </div>
            </section>

            <hr className="border-border/50" />

            {/* Skills Grid */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Terminal className="text-accent" /> Tech Stack
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-default-50/50 border border-border/50 hover:border-accent/50 transition-colors shadow-none">
                        <CardBody className="p-6 space-y-3">
                            <div className="p-2 w-fit rounded-lg bg-blue-500/10 text-blue-500"><Globe size={24} /></div>
                            <h3 className="font-bold text-lg">Frontend</h3>
                            <p className="text-sm text-muted-foreground">
                                Crafting responsive UIs with React, Next.js, and Tailwind CSS.
                            </p>
                        </CardBody>
                    </Card>

                    <Card className="bg-default-50/50 border border-border/50 hover:border-accent/50 transition-colors shadow-none">
                        <CardBody className="p-6 space-y-3">
                            <div className="p-2 w-fit rounded-lg bg-green-500/10 text-green-500"><Cpu size={24} /></div>
                            <h3 className="font-bold text-lg">Backend</h3>
                            <p className="text-sm text-muted-foreground">
                                Building robust APIs with Spring Boot, Java, and Node.js.
                            </p>
                        </CardBody>
                    </Card>

                    <Card className="bg-default-50/50 border border-border/50 hover:border-accent/50 transition-colors shadow-none">
                        <CardBody className="p-6 space-y-3">
                            <div className="p-2 w-fit rounded-lg bg-orange-500/10 text-orange-500"><Database size={24} /></div>
                            <h3 className="font-bold text-lg">Database</h3>
                            <p className="text-sm text-muted-foreground">
                                Optimizing data with PostgreSQL, MongoDB, and Redis.
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </section>

        </div>
    );
};

export default AboutPage;
