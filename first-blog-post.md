---
title: "How I Built This Blog (And Only Cried Twice)"
description: "A brutally honest breakdown of building a full-stack blog with Spring Boot and React, migrating databases mid-flight, and fighting the deployment gods."
category: "DevLogs"
tags: ["Spring Boot", "React", "PostgreSQL", "Deployment", "Mistakes"]
status: "PUBLISHED"
---

Welcome to my digital garden! 🌱 

Build a blog, they said. It'll be a fun weekend project, they said. 

Well, here we are. This site isn't just a collection of pixels; it's a monument to every "Connection Refused" error, every CORS policy violation, and the absolute panic of realizing my local MySQL database wasn't going to fly in production.

Here's exactly how I built this (and how I almost didn't).

## The "Safe" Stack 🛠️

I wanted something robust but modern. So naturally, I overcomplicated it:

-   **Backend**: **Spring Boot 3**. Because why write 10 lines of Node.js when you can write 50 lines of Java and feel enterprisey?
-   **Frontend**: **React + Vite**. I needed speed, and Create React App is so 2020.
-   **Database**: **PostgreSQL**. (We'll get to this trauma in a minute).
-   **Design**: A custom implementation of the beautiful **AstroPaper** theme, but rewritten for React because I enjoy pain.

## The Database Disaster 🐘

I started development with **MySQL** locally. It was great. `localhost:3306` felt like home. My entities were mapping, my repositories were repositories... life was good.

Then came deployment.

I decided to use **Render** for hosting because their free tier is generous (and I'm broke). But wait—Render prefers **PostgreSQL**. 

Migration time! 
1.  Swapped dependencies in `pom.xml`.
2.  Rewrote my `application.properties`.
3.  Realized Hibernate dialects are different.
4.  Prayed.

The moment of truth: `0.0.0.0/0` allowed everywhere. The connection worked! Until...

## "Connection Refused": My New Best Friend 🚫

I containerized everything with **Docker**. Locally? Works like a charm. 
Deployed? **Crash loop.**

Why? Because `localhost` inside a Docker container *isn't* `localhost` of the host machine. And trying to connect a Spring Boot container to a Postgres database without linking them in `docker-compose` or using the correct external URL is basically asking the internet to laugh at you.

**The Fix**: Environment variables. ALWAYS use environment variables. Hardcoding DB credentials is a sin I have now repented for.

## The Final Boss: CORS ⚔️

I finally got the backend running. I finally got the frontend built. I connected them.

> `Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy`

Ah, CORS. The security feature that feels like a personal attack. 
My backend didn't trust my frontend. It was like a bad breakup. I had to explicitly tell Spring Security: *"Look, it's me. Use `ALLOWED_ORIGINS`. Let the frontend in."*

## So, What's Next? 🚀

This blog is now live. It has:
-   **JWT Auth**: So only I can post (sorry).
-   **Markdown Support**: Because writing HTML manually is for sociopaths.
-   **Dark Mode**: Mandatory for developer credibility.

If you're reading this, the deployment worked. If you're not reading this... well, I'm probably debugging a 502 Bad Gateway error somewhere.

Thanks for dropping by. Expect more posts about code, tech, and things I break.

Cheers,  
**Aditya** 👨‍💻
