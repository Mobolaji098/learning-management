"use client";

import React from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { useCarousel } from "@/hooks/useCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCoursesQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import CourseCardSearch from "@/components/CourseCardSearch";


const LoadingSkeleton = () => {
    return (
        <div className="landing-skeleton">
            <div className="landing-skeleton__hero">
                <div className="landing-skeleton__hero-content">
                    <Skeleton className="landing-skeleton__title" />
                    <Skeleton className="landing-skeleton__subtitle" />
                    <Skeleton className="landing-skeleton__subtitle-secondary" />
                    <Skeleton className="landing-skeleton__button" />
                </div>
                <Skeleton className="landing-skeleton__hero-image" />
            </div>

            <div className="landing-skeleton__featured">
                <Skeleton className="landing-skeleton__featured-title" />
                <Skeleton className="landing-skeleton__featured-description" />

                <div className="landing-skeleton__tags">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                        <Skeleton key={index} className="landing-skeleton__tag" />
                    ))}
                </div>

                <div className="landing-skeleton__courses">
                    {[1, 2, 3, 4].map((_, index) => (
                        <Skeleton key={index} className="landing-skeleton__course-card" />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Landing = () => {
    const router = useRouter();
    const currentImage = useCarousel({ totalImages: 3 });
    const { data: courses, isLoading, isError } = useGetCoursesQuery({});

    useGSAP(()=> {

        // Register the ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(".landing", {
            opacity: 0,
        },{
            opacity: 1,
            duration:0.5,
        })
        gsap.fromTo(".landing__hero", {
            opacity: 0,
            y:20
        },{
            y:0,
            opacity: 1,
            duration:0.5,
        })

        // GSAP animation with ScrollTrigger
        gsap.fromTo(
            ".landing__featured",
            { y: 20, opacity: 0 }, // Initial state
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                scrollTrigger: {
                    trigger: '.landing__featured', // Element that triggers the animation
                    start: "top 70%", // Trigger animation when element is 70% in viewport
                    once: true, // Animate only once
                },
            }
        );

        // GSAP animation with ScrollTrigger
        gsap.fromTo(
            '.landing__courses-course',
            { y: 50, opacity: 0 }, // Initial state
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger:0.2,
                scrollTrigger: {
                    trigger: '.landing__courses-course', // Element that triggers the animation
                    start: "top 90%", // Trigger animation when element is 90% in viewport
                    once: true, // Animate only once
                },
            }
        );

    },[isLoading])


    const handleCourseClick = (courseId: string) => {
        router.push(`/search?id=${courseId}`, {
            scroll: false,
        });
    };

    if (isLoading) return <LoadingSkeleton />;


    return (
        <div
            className="landing"
        >
            <div
                className="landing__hero"
            >
                <div className="landing__hero-content">
                    <h1 className="landing__title">Courses</h1>
                    <p className="landing__description">
                        This is the list of the courses you can enroll in.
                        <br />
                        Courses when you need them and want them.
                    </p>
                    <div className="landing__cta">
                        <Link href="/search" scroll={false}>
                            <div className="landing__cta-button">Search for Courses</div>
                        </Link>
                    </div>
                </div>
                <div className="landing__hero-images">
                    {["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"].map((src, index) => (
                        <Image
                            key={src}
                            src={src}
                            alt={`Hero Banner ${index + 1}`}
                            fill
                            priority={index === currentImage}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className={`landing__hero-image ${
                                index === currentImage ? "landing__hero-image--active" : ""
                            }`}
                        />
                    ))}
                </div>
            </div>
            <div
                className="landing__featured"
            >
                <h2 className="landing__featured-title">Featured Courses</h2>
                <p className="landing__featured-description">
                    From beginner to advanced, in all industries, we have the right
                    courses just for you and preparing your entire journey for learning
                    and making the most.
                </p>

                <div className="landing__tags">
                    {[
                        "web development",
                        "enterprise IT",
                        "react nextjs",
                        "javascript",
                        "backend development",
                    ].map((tag, index) => (
                        <span key={index} className="landing__tag">
              {tag}
            </span>
                    ))}
                </div>

                <div className="landing__courses">
                    {courses &&
                        courses.slice(0, 4).map((course, index) => (
                            <div
                                key={course.courseId}
                                className={`landing__courses-course`}
                            >

                                <CourseCardSearch
                                    course={course}
                                    onClick={() => handleCourseClick(course.courseId)}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Landing;