"use client";

import Loading from "@/components/Loading";
import { useGetCoursesQuery } from "@/state/api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import gsap from 'gsap';
import CourseCardSearch from "@/components/CourseCardSearch";
import SelectedCourse from "./SelectedCourse";
import {useGSAP} from "@gsap/react";

const Search = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { data: courses, isLoading, isError } = useGetCoursesQuery({});
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (courses) {
            if (id) {
                const course = courses.find((c) => c.courseId === id);
                setSelectedCourse(course || courses[0]);
            } else {
                setSelectedCourse(courses[0]);
            }
        }
    }, [courses, id]);

    useGSAP(()=> {
        gsap.fromTo(".search", {
            opacity: 0,
        },{
            opacity: 1,
            duration:0.5,
        })
        gsap.fromTo(".search", {
            opacity: 0,
        },{
            opacity: 1,
            duration:0.5,
        })
        gsap.fromTo(".search__courses-grid", {
            opacity: 0,
            y:40,
        },{
            opacity: 1,
            y:0,
            duration:0.5,
            stagger:0.2
        })
        gsap.fromTo(".search__selected-course", {
            opacity: 0,
            y:40,
        },{
            opacity: 1,
            y:0,
            duration:0.5,
            stagger:0.5
        })
    },[isLoading])

    if (isLoading) return <Loading />;
    if (isError || !courses) return <div>Failed to fetch courses</div>;

    const handleCourseSelect = (course: Course) => {
        setSelectedCourse(course);
        router.push(`/search?id=${course.courseId}`, {
            scroll: false,
        });
    };

    const handleEnrollNow = (courseId: string) => {
        router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`, {
            scroll: false,
        });
    };

    return (
        <div
            className="search"
        >
            <h1 className="search__title">List of available courses</h1>
            <h2 className="search__subtitle">{courses.length} courses avaiable</h2>
            <div className="search__content">
                <div
                    className="search__courses-grid"
                >
                    {courses.map((course) => (
                        <CourseCardSearch
                            key={course.courseId}
                            course={course}
                            isSelected={selectedCourse?.courseId === course.courseId}
                            onClick={() => handleCourseSelect(course)}
                        />
                    ))}
                </div>

                {selectedCourse && (
                    <div
                        className="search__selected-course"
                    >
                        <SelectedCourse
                            course={selectedCourse}
                            handleEnrollNow={handleEnrollNow}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;